---
title: "CAP Theorem"
category: "Distributed Systems"
---

# CAP Theorem

The CAP theorem, formulated by Eric Brewer in 2000, states that a distributed data store can provide at most two out of three guarantees: Consistency, Availability, and Partition Tolerance. Since network partitions are inevitable in distributed systems, the real choice is between consistency and availability during a partition event.

## Intent

- Understand the trade-offs between consistency, availability, and partition tolerance in distributed systems
- Learn when to choose CP (consistent but may be unavailable) vs AP (available but may serve stale data) architectures
- Apply CAP reasoning to real-world system design decisions with quantifiable impact

## Architecture Overview

```mermaid
graph TB
    subgraph CAP["CAP Triangle"]
        C["Consistency\nAll nodes see same data\nat the same time"]
        A["Availability\nEvery request receives\na response"]
        P["Partition Tolerance\nSystem operates despite\nnetwork failures"]
    end

    C --- A
    A --- P
    P --- C

    subgraph CP["CP Systems"]
        CP1["HBase"]
        CP2["MongoDB (default)"]
        CP3["Redis Cluster"]
        CP4["ZooKeeper"]
    end

    subgraph AP["AP Systems"]
        AP1["Cassandra"]
        AP2["DynamoDB"]
        AP3["CouchDB"]
        AP4["Riak"]
    end

    C --> CP
    A --> AP
```

## Key Concepts

### CAP Properties

| Property            | Definition                               | During Partition                   | Example                |
| ------------------- | ---------------------------------------- | ---------------------------------- | ---------------------- |
| Consistency         | Every read returns the most recent write | Reject writes or block reads       | Bank balance query     |
| Availability        | Every request gets a non-error response  | Accept writes on all nodes         | Social media feed      |
| Partition Tolerance | System continues despite message loss    | Must be chosen — partitions happen | Any distributed system |

### Consistency Models Spectrum

| Model                 | Guarantee                          | Latency               | Use Case               |
| --------------------- | ---------------------------------- | --------------------- | ---------------------- |
| Strong (Linearizable) | Read always returns latest write   | 50-200ms cross-region | Financial transactions |
| Sequential            | Operations appear in program order | 20-100ms              | Distributed locks      |
| Causal                | Causally related ops are ordered   | 10-50ms               | Collaborative editing  |
| Eventual              | Replicas converge over time        | 1-10ms                | Social media likes     |

---

**Why this example:** Banking is the canonical CP scenario because financial transactions have zero tolerance for data inconsistency — a stale balance read can directly cause monetary loss through double-spending. This example uniquely illustrates how regulatory consequences (fines, audits) force architects to sacrifice availability in the minority partition, making the CP trade-off non-negotiable rather than preferential.

## Industry Problem 1: Banking System — Choosing CP

```mermaid
sequenceDiagram
    participant Client
    participant GLB as Global Load Balancer<br/>(AWS Route53 + health checks)
    participant Primary as Primary DB<br/>(PostgreSQL 15, r6g.4xlarge)<br/>US-East-1
    participant Replica1 as Sync Replica<br/>(PostgreSQL 15, r6g.4xlarge)<br/>US-West-2
    participant Replica2 as Sync Replica<br/>(PostgreSQL 15, r6g.4xlarge)<br/>EU-West-1
    participant PD as Partition Detector<br/>(heartbeat every 500ms)

    Note over Primary,Replica2: Normal operation — all 3 nodes healthy
    Client->>GLB: Transfer $5,000
    GLB->>Primary: |route via latency policy, 2ms| Write transaction
    Primary->>Replica1: |sync replication, 15ms RTT| WAL stream
    Replica1-->>Primary: |ACK within 20ms| Write confirmed
    Primary->>Replica2: |sync replication, 85ms RTT| WAL stream
    Replica2-->>Primary: |ACK within 90ms| Write confirmed
    Primary->>Primary: Quorum achieved (3/3)
    Primary->>Client: 200 OK — committed (total: ~95ms)

    Note over Primary,Replica2: ⚡ Network partition: US ↔ EU link severed
    PD->>PD: EU-West-1 missed 3 heartbeats (1.5s)
    PD->>GLB: Mark EU-West-1 unhealthy
    GLB->>GLB: Update routing — remove EU-West-1

    Client->>GLB: Transfer $2,000 (from EU user)
    GLB->>Primary: |rerouted to US-East-1, 120ms RTT| Write transaction
    Primary->>Replica1: |sync replication, 15ms RTT| WAL stream
    Replica1-->>Primary: ACK
    Primary->>Replica2: |BLOCKED — partition| WAL stream
    Primary->>Primary: Quorum achieved (2/3 — majority sufficient)
    Primary->>Client: 200 OK — committed (total: ~140ms)

    Note over Replica2: EU-West-1 isolated — serves NO reads
    Client->>Replica2: Check balance (direct EU request)
    Replica2->>Client: 503 Service Unavailable<br/>"Partition detected, retry via us-east-1"

    Note over Primary,Replica2: ✅ Partition heals after 45 seconds
    Replica2->>Primary: |catch-up replication| Request WAL from LSN 0xA3F7
    Primary->>Replica2: |stream 1,247 missed txns, ~2.1s| WAL replay
    Replica2->>Replica2: Apply WAL — now consistent
    PD->>GLB: Mark EU-West-1 healthy
    GLB->>GLB: Restore EU routing
    Client->>Replica2: Check balance
    Replica2->>Client: 200 OK — $43,000.00 (consistent)
```

**How this solves the problem:** This architecture guarantees linearizable consistency by requiring a write quorum of 2/3 replicas before acknowledging any transaction. During the partition, EU-West-1 self-fences and returns 503 rather than serving potentially stale balance data — eliminating the double-spend risk entirely. The global load balancer detects the partition within 1.5 seconds via heartbeat failure and reroutes EU clients to the US-East majority partition, increasing latency to ~140ms but preserving correctness. The bank trades a brief availability gap (1.5s detection + DNS propagation) for absolute data integrity, which is the correct trade-off when a single inconsistent read can trigger $2M in regulatory fines.

**Problem**: A bank processes 12M transactions/day across 3 regions. During a 45-second network partition between US and EU, customers in EU must not see stale balances that could allow double-spending. A $50K overdraft incident costs the bank $2M in regulatory fines.

**Solution**: Deploy a CP architecture using synchronous replication with a quorum of 2/3 replicas. During partitions, the minority partition (EU) returns 503 rather than stale data. Clients retry against the majority partition via global load balancer failover within 3 seconds.

**Key Decisions**:

- Synchronous replication with write quorum of 2/3 nodes — adds 15ms latency but guarantees consistency
- EU clients get routed to US-East during partition via DNS failover (RTT ~120ms vs normal 8ms)
- Accept 0.01% request failure rate during partitions to prevent any inconsistent reads
- Implement read-your-writes consistency for balance checks using session stickiness

---

**Why this example:** Social media represents the purest AP use case because the cost of unavailability (lost ad revenue at $140K/hour) vastly outweighs the cost of temporary inconsistency (a like counter off by a few). This scenario highlights how eventual consistency is not just acceptable but strategically optimal when data naturally converges and users cannot perceive sub-second staleness in counters and feeds.

## Industry Problem 2: Social Media — Choosing AP with Eventual Consistency

```mermaid
graph TB
    subgraph Region_US["US-East-1 Region"]
        US_LB["ALB\n(Application Load Balancer)"]
        US_App1["App Server 1\n(Node.js, c6g.2xlarge)"]
        US_App2["App Server 2\n(Node.js, c6g.2xlarge)"]
        US_DB_C1["Cassandra Node 1\n(i3.2xlarge, RF=3)"]
        US_DB_C2["Cassandra Node 2\n(i3.2xlarge, RF=3)"]
        US_DB_C3["Cassandra Node 3\n(i3.2xlarge, RF=3)"]
    end

    subgraph Region_EU["EU-West-1 Region"]
        EU_LB["ALB"]
        EU_App1["App Server 1\n(Node.js, c6g.2xlarge)"]
        EU_DB_C1["Cassandra Node 1\n(i3.2xlarge, RF=3)"]
        EU_DB_C2["Cassandra Node 2\n(i3.2xlarge, RF=3)"]
        EU_DB_C3["Cassandra Node 3\n(i3.2xlarge, RF=3)"]
    end

    subgraph Region_APAC["AP-Southeast-1 Region"]
        APAC_LB["ALB"]
        APAC_App1["App Server 1\n(Node.js, c6g.2xlarge)"]
        APAC_DB_C1["Cassandra Node 1\n(i3.2xlarge, RF=3)"]
        APAC_DB_C2["Cassandra Node 2\n(i3.2xlarge, RF=3)"]
        APAC_DB_C3["Cassandra Node 3\n(i3.2xlarge, RF=3)"]
    end

    US_DB_C1 -->|"async replication\n~85ms, 12K ops/s"| EU_DB_C1
    EU_DB_C1 -->|"async replication\n~160ms, 8K ops/s"| APAC_DB_C1
    APAC_DB_C1 -->|"async replication\n~130ms, 10K ops/s"| US_DB_C1

    US_DB_C2 -.->|"hints handoff\nif peer unreachable"| EU_DB_C2
    EU_DB_C2 -.->|"hints handoff"| APAC_DB_C2
    APAC_DB_C2 -.->|"hints handoff"| US_DB_C2

    User1["User (NYC)\n⚡ 4ms to ALB"] --> US_LB
    User2["User (London)\n⚡ 6ms to ALB"] --> EU_LB
    User3["User (Tokyo)\n⚡ 5ms to ALB"] --> APAC_LB

    US_LB --> US_App1
    US_LB --> US_App2
    EU_LB --> EU_App1
    APAC_LB --> APAC_App1

    US_App1 -->|"LOCAL_QUORUM write\n(2/3 local nodes)"| US_DB_C1
    US_App1 -->|"LOCAL_ONE read\n~3ms"| US_DB_C2
    EU_App1 -->|"LOCAL_QUORUM write"| EU_DB_C1
    EU_App1 -->|"LOCAL_ONE read\n~3ms"| EU_DB_C2
    APAC_App1 -->|"LOCAL_QUORUM write"| APAC_DB_C1
    APAC_App1 -->|"LOCAL_ONE read\n~3ms"| APAC_DB_C2

    subgraph Repair["Anti-Entropy Repair"]
        RepairJob["Scheduled Repair\n(every 6 hours)\nMerkle tree comparison"]
    end

    RepairJob -.->|"reconcile divergent\nreplicas"| US_DB_C3
    RepairJob -.->|"reconcile"| EU_DB_C3
    RepairJob -.->|"reconcile"| APAC_DB_C3

    subgraph CRDT_Counters["CRDT Counter Resolution"]
        CW1["US write: +1 like\n(vector clock: US=5)"]
        CW2["EU write: +1 like\n(vector clock: EU=3)"]
        Merge["Merge: max per-node\nUS=5, EU=3 → total=8"]
    end

    CW1 --> Merge
    CW2 --> Merge

    subgraph DM_Path["Strong Consistency Path (DMs)"]
        DM_Write["DM Send\n(Paxos LWT)"]
        DM_Coord["Coordinator\nSERIAL consistency"]
        DM_Read["DM Read\nSERIAL consistency"]
    end

    DM_Write -->|"quorum write\nall regions, ~120ms"| DM_Coord
    DM_Coord -->|"linearizable read"| DM_Read
```

**How this solves the problem:** This architecture achieves 99.99% availability by allowing every region to accept writes independently — even during inter-region partitions, no region becomes unavailable. The `LOCAL_QUORUM` write ensures durability within a region (2/3 local nodes must ACK) while `LOCAL_ONE` reads deliver sub-5ms latency at the cost of reading data up to ~200ms stale during cross-region propagation. Counter inconsistencies (10,203 vs 10,207 likes) are invisible to users and self-heal via asynchronous replication and periodic anti-entropy repair. The hinted handoff mechanism ensures that writes destined for temporarily unreachable nodes are buffered and replayed once connectivity restores, preventing data loss even during extended partitions.

**Problem**: A social platform serves 800M DAU across 3 regions. Users post 500K updates/minute. A like counter showing 10,203 vs 10,207 is acceptable, but returning an error page costs $140K/hour in ad revenue. Availability must be 99.99% (< 52 minutes downtime/year).

**Solution**: Use Cassandra with replication factor 3 and `LOCAL_QUORUM` for writes, `LOCAL_ONE` for reads. Each region accepts writes independently and replicates asynchronously. Conflict resolution uses last-write-wins (LWW) with vector clocks for counters.

**Key Decisions**:

- `LOCAL_ONE` reads give sub-5ms latency at the cost of reading stale data up to 200ms old
- CRDTs (Conflict-free Replicated Data Types) for counters — no merge conflicts, monotonically increasing
- Anti-entropy repair runs every 6 hours to fix divergent replicas
- Separate strong-consistency path for DMs using Paxos-based lightweight transactions

---

**Why this example:** E-commerce inventory is the most instructive CAP scenario because different operations within the same system demand opposite guarantees — checkout requires CP to prevent overselling a scarce item, while catalog browsing requires AP to handle 20M views/hour without latency spikes. This dual-path pattern demonstrates that CAP is a per-operation decision, not a system-wide one, which is the most practical takeaway for real-world architects.

## Industry Problem 3: Inventory Management — Balancing CP and AP per Operation

```mermaid
graph TB
    subgraph Gateway["API Gateway (Kong, r6g.xlarge)"]
        Router["Smart Router\n(inspects URL path + HTTP method)"]
        CB["Circuit Breaker\n(Hystrix, 5s timeout,\n50% failure threshold)"]
    end

    subgraph CP_Path["CP Path — Stock Decrements (US-East-1)"]
        CP_Lock["Distributed Lock\n(Redis Cluster, 6 nodes)\nTTL=500ms, Redlock algorithm"]
        CP_Primary["PostgreSQL Primary\n(r6g.4xlarge, 64GB RAM)\nUS-East-1a"]
        CP_Sync["PostgreSQL Sync Replica\n(r6g.4xlarge)\nUS-East-1b"]
        CP_Queue["Fallback Queue\n(SQS FIFO)\nExactly-once processing"]
    end

    subgraph AP_Path["AP Path — Catalog Browsing (Multi-Region)"]
        CDN["CloudFront CDN\n(220+ edge locations)\nTTL=30s"]
        Cache_US["Redis Cache (US)\n(r6g.2xlarge, 52GB)"]
        Cache_EU["Redis Cache (EU)\n(r6g.2xlarge, 52GB)"]
        AP_Read1["Read Replica 1\n(PostgreSQL, US-West-2)\nasync replication ~50ms lag"]
        AP_Read2["Read Replica 2\n(PostgreSQL, EU-West-1)\nasync replication ~90ms lag"]
    end

    subgraph Partition_Handling["Partition / Failure Handling"]
        PD["Partition Detector\n(health checks every 1s)"]
        Fallback["Graceful Degradation:\n1. Lock timeout → queue order\n2. DB down → serve cached catalog\n3. CDN miss → stale-while-revalidate"]
    end

    User_Checkout["User: POST /checkout\n⚡ latency budget: 200ms"] --> Router
    User_Browse["User: GET /products\n⚡ latency budget: 50ms"] --> Router

    Router -->|"POST /checkout\n(stock-sensitive)"| CB
    CB -->|"lock acquire: 15ms"| CP_Lock
    CP_Lock -->|"BEGIN; UPDATE stock\nSET qty = qty - 1\nWHERE qty > 0"| CP_Primary
    CP_Primary -->|"sync replication\n8ms RTT"| CP_Sync
    CP_Sync -->|"ACK"| CP_Primary
    CP_Primary -->|"COMMIT"| CP_Lock
    CP_Lock -->|"release lock"| Router

    CB -->|"lock timeout / failure"| CP_Queue
    CP_Queue -->|"process within 5s\nwith retry"| CP_Primary

    Router -->|"GET /products\n(read-heavy)"| CDN
    CDN -->|"HIT: 2ms\n(85% hit rate)"| User_Browse
    CDN -->|"MISS"| Cache_US
    Cache_US -->|"HIT: 4ms"| CDN
    Cache_US -->|"MISS"| AP_Read1
    AP_Read1 -->|"query: 12ms"| Cache_US

    Cache_EU -->|"populated via\nasync replication"| AP_Read2

    PD -.->|"monitors"| CP_Lock
    PD -.->|"monitors"| CP_Primary
    PD -.->|"triggers failover"| Fallback
```

**How this solves the problem:** The smart router splits traffic by operation type, sending stock-sensitive checkout requests through the CP path (distributed lock → synchronous write → quorum commit) and read-heavy catalog requests through the AP path (CDN → cache → async replica). This gives checkout a 40ms latency with zero overselling via the Redlock algorithm and atomic `UPDATE ... WHERE qty > 0`, while catalog pages load in under 8ms at the CDN edge with 85% hit rate. When the CP path degrades (lock timeout or primary failure), the circuit breaker routes orders into an SQS FIFO queue for exactly-once processing within 5 seconds — converting a hard failure into a brief delay. The per-SKU consistency strategy adds further nuance: scarce items (<500 stock) always take the CP path, while bulk items (>10K stock) tolerate the AP path with periodic reconciliation, optimizing resource usage across the full inventory.

**Problem**: An e-commerce platform handles 50K orders/minute during flash sales. Overselling 100 units of a limited item (2,000 total stock) causes $300K in compensation costs. Meanwhile, product catalog pages (20M views/hour) must load in < 200ms or conversion drops 7%.

**Solution**: Implement a dual-path architecture. Checkout (stock decrement) uses a CP path with distributed locks and synchronous replication — 40ms latency but zero overselling. Catalog browsing uses an AP path with aggressive caching and async replicas — 8ms latency, data may be 30 seconds stale.

**Key Decisions**:

- Redis distributed lock with 500ms TTL for stock decrement — prevents double-sell across regions
- Catalog data cached in CDN with 30s TTL; stale stock counts are acceptable for browsing
- Circuit breaker on CP path: if lock service is down, queue the order and process within 5 seconds
- Per-SKU consistency: high-demand items (<500 stock) use CP; bulk items (>10K stock) use AP with periodic reconciliation

---

## Anti-Patterns

| Anti-Pattern                    | Problem                                  | Better Approach                                                  |
| ------------------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| Treating CAP as binary          | Applying one model to all operations     | Use per-operation consistency levels                             |
| Ignoring partition duration     | Designing for seconds but facing minutes | Plan for 30-min+ partitions with graceful degradation            |
| Strong consistency everywhere   | 200ms+ latency on every read             | Reserve strong consistency for writes that require it            |
| No conflict resolution strategy | Divergent data after partition heals     | Implement LWW, vector clocks, or CRDTs upfront                   |
| Ignoring PACELC                 | Only considering partition behavior      | Also optimize for latency vs consistency during normal operation |

---

> **Key Takeaway**: CAP is not a one-time architectural choice — it's a per-operation decision. The best distributed systems use CP for operations where inconsistency causes financial or safety harm, and AP for operations where availability and low latency drive business value. Design for the partition, but optimize for the common case.
