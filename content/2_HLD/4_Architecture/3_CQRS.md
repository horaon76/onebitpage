---
title: "CQRS"
category: "Architecture Patterns"
---

# CQRS — Command Query Responsibility Segregation

CQRS separates the write model (commands that change state) from the read model (queries that return data). Instead of a single data model serving both reads and writes, you maintain specialized models optimized for each purpose. Combined with event sourcing, CQRS enables complete audit trails, temporal queries, and independently scalable read/write paths—at the cost of increased complexity and eventual consistency.

## Intent

- **Optimize reads and writes independently**: Write models enforce invariants and business rules; read models are denormalized projections optimized for specific query patterns—no more N+1 queries or compromise schemas.
- **Scale asymmetrically**: Most systems are read-heavy (90:10 or 99:1 read/write ratio). CQRS lets you scale 20 read replicas without touching the write path.
- **Enable event sourcing**: Store every state change as an immutable event. Rebuild any read model by replaying the event log—full audit trail and time-travel debugging for free.

## Architecture Overview

```mermaid
graph TB
    subgraph Client Layer
        WebApp[Web App<br/>React SPA] -->|REST/gRPC| APIGW[API Gateway<br/>Kong / Envoy]
        MobileApp[Mobile App] -->|REST/gRPC| APIGW
    end

    APIGW -->|"command: 5K/s"| CMD[Command API<br/>Spring Boot / Axon Server]
    APIGW -->|"query: 50K/s"| QRY[Query API<br/>Node.js / GraphQL]

    subgraph Write Path
        CMD --> CV[Command Validator<br/>Schema + Business Rules]
        CV --> AggRoot[Aggregate Root<br/>Domain Logic / Invariants]
        AggRoot -->|"append: 5K events/s"| ES[Event Store<br/>EventStoreDB<br/>Append-Only Log]
    end

    subgraph Event Bus
        ES -->|"change feed"| Kafka[Apache Kafka<br/>Event Backbone<br/>7-day retention]
    end

    subgraph Projections
        Kafka -->|"projection lag: ~150ms"| Proj1[Projection: User Dashboard<br/>Axon Tracking Processor]
        Kafka -->|"projection lag: ~200ms"| Proj2[Projection: Search Index<br/>Kafka Connect Sink]
        Kafka -->|"projection lag: ~500ms"| Proj3[Projection: Analytics Cube<br/>Flink Streaming Job]
    end

    subgraph Read Models
        Proj1 --> ReadDB1[(PostgreSQL 10x Replicas<br/>Denormalized Views)]
        Proj2 --> ReadDB2[(Elasticsearch 5-node<br/>Full-Text + Facets)]
        Proj3 --> ReadDB3[(ClickHouse 3-shard<br/>OLAP Aggregations)]
    end

    subgraph Snapshot & Rebuild
        ES -->|"snapshot every 10K events"| Snap[(Snapshot Store<br/>S3 / PostgreSQL)]
        Snap -.->|"rebuild projection<br/>~4h for 180 days"| Proj1
    end

    QRY -->|"p99 < 15ms"| ReadDB1
    QRY -->|"p99 < 50ms"| ReadDB2
    QRY -->|"p99 < 200ms"| ReadDB3

    style ES fill:#f9a825,color:#000
    style Kafka fill:#ff7043,color:#fff
    style CMD fill:#ef5350,color:#fff
    style QRY fill:#66bb6a,color:#000
    style Snap fill:#ab47bc,color:#fff
```

**How this architecture works:**

The API gateway routes commands and queries to entirely separate services—commands hit Axon Server for validation and event persistence at 5K/s, while queries hit a GraphQL layer backed by three purpose-built read stores. Kafka acts as the event backbone, feeding projections that each run at different lag tolerances: dashboards at 150ms, search at 200ms, and analytics at 500ms. The snapshot store enables full projection rebuilds from the event store in ~4 hours, meaning any read model can be torn down and reconstructed without data loss. This separation means the write path can be optimized for consistency and durability while the read path scales horizontally to handle 10x the traffic. Each read model uses a different storage technology—PostgreSQL for relational queries, Elasticsearch for full-text search, ClickHouse for OLAP aggregations—chosen to match its specific access pattern rather than forcing a single compromise schema.

## Key Concepts

### Command vs. Query Model

| Aspect     | Command (Write) Side                | Query (Read) Side                          |
| ---------- | ----------------------------------- | ------------------------------------------ |
| Model      | Normalized, enforces invariants     | Denormalized, optimized for queries        |
| Storage    | Event store or relational DB        | Materialized views, caches, search indices |
| Scaling    | Fewer instances, strong consistency | Many replicas, eventual consistency        |
| Validation | Business rules, domain logic        | None—reads pre-computed data               |
| Latency    | Higher (validation + persist)       | Lower (direct lookups)                     |

### Event Sourcing + CQRS

| Concept        | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| Event Store    | Append-only log of domain events (e.g., `AccountCredited`, `ItemAddedToCart`) |
| Projection     | Process that reads events and builds a read-optimized view                    |
| Snapshot       | Periodic checkpoint to avoid replaying millions of events on startup          |
| Projection Lag | Time between event written and read model updated (typically 50-500ms)        |

### When to Use CQRS

Use CQRS when read and write models diverge significantly, read/write ratios are highly asymmetric, or you need full audit trails. **Don't use it** for simple CRUD apps where a single model works fine—CQRS adds operational overhead (projections, eventual consistency, two data stores).

---

## Industry Problem 1: Banking with Full Audit Trail

**Why this example:** Banking imposes the strictest audit requirements found in any domain—regulators demand point-in-time reconstruction of financial state, making "update in place" fundamentally insufficient. This scenario illustrates CQRS at its most justified: immutable event sourcing is not optional but legally mandated, the read/write asymmetry is extreme (50:1), and the cost of getting consistency wrong is measured in regulatory fines and lost deposits.

```mermaid
sequenceDiagram
    participant C as Client<br/>(Mobile Banking App)
    participant GW as API Gateway<br/>(Kong, rate-limited)
    participant CMD as Command Service<br/>(Axon Framework, 3 instances)
    participant VAL as Validator<br/>(Balance ≥ amt, daily limits,<br/>AML screening)
    participant ES as Event Store<br/>(EventStoreDB, 3-node cluster)
    participant KF as Kafka<br/>(Event Backbone, 12 partitions)
    participant ProjBal as Balance Projection<br/>(Axon Tracking Processor)
    participant ProjStmt as Statement Projection<br/>(Flink Job)
    participant RDB as Read DB<br/>(PostgreSQL 10 replicas)
    participant StmtDB as Statement Store<br/>(Elasticsearch)
    participant Audit as Audit Service<br/>(Immutable S3 + Athena)
    participant Snap as Snapshot Store<br/>(S3, every 10K events)

    C->>GW: TransferFunds($500, A→B)
    GW->>CMD: Route command (idempotency-key: uuid-1234)
    CMD->>VAL: Validate business rules
    VAL-->>CMD: ✓ Passed (balance=$2,000, limit OK, AML clear)
    CMD->>ES: AccountDebited(A, $500, txn=uuid-1234)
    CMD->>ES: AccountCredited(B, $500, txn=uuid-1234)
    ES->>KF: Publish events (partition by accountId)

    par Projection Fan-Out
        KF->>ProjBal: Consume events |lag: ~150ms|
        ProjBal->>RDB: UPDATE balance SET amount=1500 WHERE acct=A
        KF->>ProjStmt: Consume events |lag: ~300ms|
        ProjStmt->>StmtDB: Index statement line item
        KF->>Audit: Consume events |immutable append|
        Audit->>Audit: Store in S3 (WORM, 7-yr retention)
    end

    Note over ES,Snap: Snapshot every 10K events per account<br/>avoids replaying 2M events for corporate accounts

    C->>GW: GET /balance/A
    GW->>RDB: Query denormalized view |p99 < 12ms|
    RDB-->>C: Balance: $1,500
```

**How this solves the problem:** Commands flow through a dedicated validation pipeline (AML screening, balance checks, daily limits) before appending immutable events to EventStoreDB—no row is ever updated or deleted, giving regulators a complete, tamper-proof history. The balance projection consumes events via Kafka and maintains denormalized views in PostgreSQL read replicas, achieving 12ms p99 reads at 50:1 read/write ratio. Auditors can reconstruct any account's state at any point in time by replaying the event stream up to that timestamp, eliminating the need to mine backup tapes. Snapshots every 10K events per account bound replay cost for high-volume corporate accounts to under 2 seconds.

**Problem**: A digital bank processes 2M transactions/day and must maintain a complete, immutable audit trail for regulatory compliance (SOX, PSD2). The traditional approach—updating account balances in-place—loses history. Auditors need to answer: "What was account A's balance at 3:47 PM on March 5th?" With mutable state, this requires log mining across backup tapes. Additionally, the read pattern (balance checks, statement generation) outnumbers writes 50:1.

**Solution**: Every financial operation is a command that produces immutable events (`AccountDebited`, `AccountCredited`) stored in an append-only event store (EventStoreDB). Current balances are projections—materialized views rebuilt by replaying events. Auditors query the event store directly for point-in-time state. Read-side projections run in PostgreSQL with denormalized account summaries, scaled to 10 read replicas for the 50:1 read ratio.

**Key decisions**:

- Event store is the **source of truth**; read DB can be rebuilt from scratch in ~4 hours by replaying 180 days of events
- **Snapshots** every 10,000 events per account—avoids replaying 2M events for a high-volume corporate account
- Projection lag is 200ms p99—acceptable for balance checks (regulatory allows T+1 for settlement)
- Commands are **idempotent** using client-generated IDs—retry-safe without double-crediting

---

## Industry Problem 2: Social Media Feed Generation

**Why this example:** Social media feeds expose the fan-out scaling dilemma that CQRS was practically designed to solve—a single write (one post) must propagate to millions of read-side views. This scenario is uniquely challenging because the read/write asymmetry is the most extreme in any domain (a celebrity's post triggers millions of feed updates), and the latency budget is brutally tight (sub-200ms). It forces the system to make a genuine architectural tradeoff between fan-out-on-write and fan-out-on-read that no single-model approach can serve.

```mermaid
graph TB
    subgraph Write Path - 12K commands/s
        User[User Action<br/>Post / Like / Follow] -->|"REST API"| CMD2[Command Service<br/>Go microservice, 8 instances]
        CMD2 -->|"validate + persist"| GDB[(Graph Store<br/>Neo4j 3-node causal cluster<br/>Relationships Only)]
        CMD2 -->|"append: 12K events/s"| ES2[Event Store<br/>EventStoreDB<br/>PostCreated, Liked,<br/>Followed, Unfollowed]
    end

    subgraph Event Backbone
        ES2 -->|"change feed"| KF2[Apache Kafka<br/>24 partitions<br/>keyed by userId]
    end

    subgraph Projection Layer
        KF2 -->|"fan-out-on-write<br/>for users < 10K followers"| FP[Feed Projector<br/>Flink Streaming, 16 tasks<br/>Writes to 99% of users]
        KF2 -->|"celebrity path<br/>users ≥ 10K followers"| CP[Celebrity Cache Builder<br/>Precompute top-200 posts]
        FP -->|"~1-3s projection lag"| Cache[(Redis Cluster 6-node<br/>Sorted Sets per User<br/>Top 500 items, ~2KB/user)]
        CP -->|"~5s lag, on-read merge"| CCache[(Celebrity Cache<br/>Redis, TTL=60s)]
    end

    subgraph Read Path - 100K queries/s
        Mobile[Mobile App] -->|"GET /feed"| QS[Query Service<br/>Node.js, 20 instances]
        QS -->|"ZREVRANGE O(1)<br/>p99 < 15ms"| Cache
        QS -->|"merge celebrity posts<br/>on read for followers > 10K"| CCache
    end

    subgraph Projection Rebuild
        ES2 -.->|"full rebuild<br/>~6h for 50M users"| FP
        ES2 -.->|"snapshot every 50K events"| Snap2[(Snapshot Store<br/>S3)]
    end

    style ES2 fill:#f9a825,color:#000
    style KF2 fill:#ff7043,color:#fff
    style Cache fill:#ef5350,color:#fff
    style FP fill:#42a5f5,color:#000
    style CP fill:#ab47bc,color:#fff
    style CCache fill:#ab47bc,color:#fff
```

**How this solves the problem:** The write path captures user actions as events while the feed projector asynchronously fans out each post to followers' precomputed feeds in Redis sorted sets—turning a read-time join across 500+ accounts into a single O(1) `ZREVRANGE` call with 15ms p99 latency. The celebrity carve-out prevents a single post from triggering millions of Redis writes; instead, celebrity content is cached separately and merged at read time for their followers. This two-tier projection strategy keeps 99% of feed writes bounded while honoring the sub-200ms latency budget even at 100K concurrent requests. Full projection rebuilds from the event store take ~6 hours but are scoped per partition, so individual projections can be rebuilt without affecting others.

**Problem**: A social platform with 50M users generates personalized feeds. Each feed aggregates posts from followed accounts, ranked by relevance. A naive approach—query all followed accounts' posts at read time—requires joining across 500+ accounts per user with ranking. At 100K concurrent feed requests, this query fan-out saturates the database at p99 > 3s latency. Users expect feeds to load in under 200ms.

**Solution**: CQRS with fan-out-on-write. The write side stores relationships in Neo4j (graph queries for "who follows whom") and emits events (`PostCreated`, `UserFollowed`). A feed projector consumes events and precomputes each user's feed into Redis sorted sets (score = relevance). Read path is a single Redis `ZREVRANGE`—O(1) per user, p99 under 15ms. Celebrity accounts (1M+ followers) use a hybrid: fan-out-on-read with cached results to avoid writing to 1M feeds.

**Key decisions**:

- **Fan-out-on-write** for users with < 10K followers (99% of users); fan-out-on-read for celebrities
- Redis sorted sets hold top 500 feed items per user—bounded memory at ~2KB/user = 100GB for 50M users
- Feed staleness is 1-3 seconds—acceptable for social media (not financial data)
- Graph store handles write-side relationship queries; **never** queried on the read path

---

## Industry Problem 3: Inventory Management with Real-Time Availability

**Why this example:** Inventory is the canonical "multiple writers, one truth" problem—POS terminals, warehouses, and e-commerce checkouts all compete to mutate the same quantity field, producing deadlocks and oversells in traditional architectures. This scenario uniquely demonstrates how event sourcing eliminates write contention entirely (append-only, no row locks) while projections serve radically different read shapes (real-time ATP for checkout, batch dashboards for warehouse ops, threshold-triggered alerts) from the same event stream.

```mermaid
graph TB
    subgraph Command Sources - 3 Channels
        POS2[POS System<br/>500 stores, ~8K txn/s] -->|"SaleCompleted<br/>|8K events/s|"| CMD3[Command Service<br/>Axon Framework, 6 instances]
        WMS[Warehouse Management<br/>12 distribution centers] -->|"StockReceived<br/>|500 events/s|"| CMD3
        Web[E-commerce Site<br/>Peak: 20K concurrent] -->|"ItemReserved / OrderPlaced<br/>|3K events/s|"| CMD3
    end

    subgraph Write Path
        CMD3 --> AggInv[Inventory Aggregate<br/>Validates: available ≥ requested<br/>Enforces reservation TTL]
        AggInv -->|"append: 11.5K events/s"| ES3[Event Store<br/>EventStoreDB 5-node<br/>StockReceived, SaleCompleted,<br/>ItemReserved, ReservationExpired]
    end

    subgraph Event Backbone
        ES3 -->|"change feed"| KF3[Apache Kafka<br/>36 partitions<br/>keyed by SKU]
    end

    subgraph Read Projections
        KF3 -->|"projection lag: ~100ms"| P1[ATP Projection<br/>available = received - sold<br/>- reserved + expired]
        KF3 -->|"projection lag: ~30s batch"| P2[Warehouse Dashboard<br/>Projection]
        KF3 -->|"projection lag: ~100ms"| P3[Reorder Alert<br/>Projection<br/>Trigger: ATP < safety stock]
    end

    subgraph Read Models
        P1 -->|"write-through"| ATP[(Redis Cluster 4-node<br/>Real-Time ATP per SKU<br/>2M keys)]
        P2 -->|"batch upsert every 30s"| PG[(PostgreSQL 3 replicas<br/>Warehouse Views<br/>Inventory by location)]
        P3 -->|"threshold check"| Alert2[Alert Service<br/>PagerDuty + Slack<br/>Low Stock Notifications]
    end

    subgraph Snapshot & Rebuild
        ES3 -->|"snapshot every 1K events/SKU"| SnapInv[(Snapshot Store<br/>S3 / DynamoDB)]
        SnapInv -.->|"rebuild ATP projection<br/>~2h for 2M SKUs"| P1
    end

    Web -->|"checkout: check ATP<br/>p99 < 8ms"| ATP

    subgraph Consistency Window
        Note1[Eventual consistency: ~100ms<br/>Edge case oversell rate: 0.05%<br/>Compensating event:<br/>OrderCancelledDueToOversell]
    end

    style ES3 fill:#f9a825,color:#000
    style KF3 fill:#ff7043,color:#fff
    style ATP fill:#ef5350,color:#fff
    style SnapInv fill:#ab47bc,color:#fff
```

**How this solves the problem:** All inventory mutations—POS sales, warehouse receipts, online reservations—are captured as immutable events appended to EventStoreDB, eliminating row-level contention and deadlocks entirely. The ATP projection maintains a real-time inventory count in Redis (`available = received - sold - reserved + expired`) with only 100ms lag, letting the e-commerce checkout verify stock in 8ms p99 instead of locking a shared quantity row. The reservation pattern with 15-minute TTLs prevents cart-hoarding; expired reservations emit `ReservationExpired` events that automatically restore available stock.
Separate projections serve warehouse dashboards (PostgreSQL, batch-updated every 30s) and reorder alerts (PagerDuty triggers when ATP drops below safety stock)—three radically different read shapes from one event stream, each optimized for its consumer.

**Problem**: A retailer with 500 stores and an e-commerce site manages 2M SKUs. Inventory is modified by POS sales, warehouse receiving, online orders, and reservation expirations. A single "quantity" column updated by all sources produces constant deadlocks and stale reads. The e-commerce site shows "In Stock" but by the time checkout completes, the last unit was sold in-store. Overselling costs $2M/year in cancellations and customer dissatisfaction.

**Solution**: Event-source all inventory changes: `StockReceived`, `SaleCompleted`, `ItemReserved`, `ReservationExpired`. The write side validates commands against the current aggregate state (e.g., can't sell more than available). The Available-to-Promise (ATP) projection maintains a real-time count in Redis: `available = received - sold - reserved + expired`. E-commerce checks ATP before allowing checkout. Separate projections power warehouse dashboards (PostgreSQL, updated every 30s) and reorder alerts (trigger when ATP drops below safety stock).

**Key decisions**:

- **Reservation pattern** with TTL: online carts reserve inventory for 15 minutes; `ReservationExpired` events auto-release
- ATP projection lag is 100ms—short enough to prevent most overselling; remaining edge cases handled by compensating events (`OrderCancelledDueToOversell`)
- Overselling dropped from $2M/year to $50K/year (97.5% reduction)
- Snapshots every 1,000 events per SKU—top-selling SKUs accumulate 10K+ events/day

---

## Anti-Patterns

| Anti-Pattern            | Description                                           | Consequence                                                   |
| ----------------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| **CQRS Everywhere**     | Applying CQRS to every service, including simple CRUD | 3x development cost for zero benefit on simple domains        |
| **Stale Read Denial**   | Pretending eventual consistency doesn't exist         | Users see inconsistent data with no explanation; trust erodes |
| **Projection Monolith** | Single projection service handles all read models     | One slow projection blocks all others; scaling bottleneck     |
| **Missing Snapshots**   | Replaying full event history on every aggregate load  | Startup takes minutes for high-volume aggregates              |
| **Bidirectional Sync**  | Read model writes back to event store                 | Infinite loops, data corruption, architectural chaos          |

---

> **Key Takeaway**: CQRS earns its complexity when reads and writes have fundamentally different shapes, scales, or consistency requirements. The sweet spot is domains with high read/write asymmetry (50:1+), audit requirements, or multiple read representations of the same data. If your read and write models look the same, a single model with read replicas is simpler and sufficient—don't reach for CQRS out of architectural ambition.
