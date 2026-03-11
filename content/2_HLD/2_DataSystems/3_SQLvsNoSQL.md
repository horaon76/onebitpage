---
title: "SQL vs NoSQL"
category: "Data Systems"
---

# SQL vs NoSQL

Choosing between SQL and NoSQL is not about which is "better" — it's about which data model, consistency guarantees, and scaling characteristics match your workload. SQL databases (PostgreSQL, MySQL) enforce schemas and ACID transactions, making them ideal for relational data with complex joins. NoSQL databases (MongoDB, Cassandra, Neo4j) trade some of those guarantees for flexible schemas, horizontal scalability, or specialized data models. Most real-world systems use both.

## Intent

- Understand the fundamental trade-offs between relational and non-relational data stores.
- Map workload characteristics (schema rigidity, query patterns, scale, consistency needs) to the right database type.
- Recognize that polyglot persistence — using multiple databases for different use cases — is the norm, not the exception.

## Architecture Overview

```mermaid
graph TB
    subgraph AppTier["Application Tier"]
        App[Application Layer<br/>Polyglot Persistence Router]
    end

    subgraph RelationalStore["Relational — ACID Guarantees"]
        SQL[(PostgreSQL 16<br/>r6g.4xlarge)]
    end

    subgraph DocumentStore["Document — Flexible Schema"]
        DocStore[(MongoDB 7.0<br/>M50 Atlas Cluster)]
    end

    subgraph WideColumn["Wide-Column — Write Optimized"]
        WideCol[(Cassandra 4.1<br/>i3.2xlarge × 9 nodes)]
    end

    subgraph GraphStore["Graph — Relationship Traversal"]
        GraphDB[(Neo4j 5.x<br/>Enterprise Cluster)]
    end

    subgraph CacheTier["Cache — Sub-ms Reads"]
        Cache[(Redis 7.2<br/>r7g.xlarge ElastiCache)]
    end

    App -->|"structured joins, ACID txns"| SQL
    App -->|"schema-on-read, nested docs"| DocStore
    App -->|"50K writes/sec, append-only"| WideCol
    App -->|"multi-hop traversal, Cypher"| GraphDB
    App -->|"hot data, < 1ms reads"| Cache

    SQL -.->|"foreign keys, CHECK constraints"| Orders[Orders, Users, Payments]
    DocStore -.->|"JSON docs, partial updates"| Catalog[Product Catalog, CMS]
    WideCol -.->|"partition key = device_id"| TimeSeries[Metrics, IoT Events]
    GraphDB -.->|"nodes + edges + properties"| Social[Friend Graph, Recommendations]
    Cache -.->|"TTL-based eviction"| Sessions[User Sessions, Leaderboards]

    Orders -.->|"JOIN-heavy OLTP"| QueryPatterns[Complex Queries<br/>Aggregations, Subqueries]
    Catalog -.->|"nested lookups"| QueryPatterns2[Flexible Filters<br/>Faceted Search]
    TimeSeries -.->|"range scans by time"| QueryPatterns3[Time-Window Queries<br/>Rollups, Downsampling]
    Social -.->|"multi-hop Cypher"| QueryPatterns4[Traversal Queries<br/>Shortest Path, PageRank]
    Sessions -.->|"GET/SET, TTL"| QueryPatterns5[Point Lookups<br/>Pub/Sub, Streams]
```

## Key Concepts

### ACID vs BASE

| Property        | ACID (SQL)                                 | BASE (NoSQL)                                |
| --------------- | ------------------------------------------ | ------------------------------------------- |
| **Atomicity**   | All-or-nothing transactions                | Partial writes possible                     |
| **Consistency** | Every read sees the latest committed write | Eventually consistent                       |
| **Isolation**   | Concurrent transactions don't interfere    | Conflicts may be visible                    |
| **Durability**  | Committed data survives crashes            | Durable (usually), but tunable              |
| **Trade-off**   | Higher latency, harder to scale writes     | Lower latency, easier to scale horizontally |

### NoSQL Data Models

| Type               | Data Model                 | Query Strength                | Example DBs                   | Best For                         |
| ------------------ | -------------------------- | ----------------------------- | ----------------------------- | -------------------------------- |
| **Document Store** | JSON/BSON documents        | Flexible queries, nested data | MongoDB, CouchDB, Firestore   | Catalogs, CMS, user profiles     |
| **Wide-Column**    | Row key → column families  | Fast writes, range scans      | Cassandra, HBase, ScyllaDB    | Time-series, IoT, event logs     |
| **Key-Value**      | Simple key → value         | Point lookups by key          | Redis, DynamoDB, Riak         | Caching, sessions, config        |
| **Graph**          | Nodes + edges + properties | Relationship traversal        | Neo4j, Amazon Neptune, Dgraph | Social networks, fraud detection |

### Decision Guide

```mermaid
graph TB
    Start[What's your primary need?] --> Q1{Complex joins & transactions?}
    Q1 -->|Yes| SQL[Use SQL — PostgreSQL / MySQL]
    Q1 -->|No| Q2{Flexible schema, rapid iteration?}
    Q2 -->|Yes| Doc[Document Store — MongoDB]
    Q2 -->|No| Q3{Massive write throughput?}
    Q3 -->|Yes| WC[Wide-Column — Cassandra]
    Q3 -->|No| Q4{Relationship traversal?}
    Q4 -->|Yes| Graph[Graph DB — Neo4j]
    Q4 -->|No| KV[Key-Value — Redis / DynamoDB]
```

---

**Why this example:** Healthcare is the canonical case where partial writes are not just a bug but a patient safety hazard — a half-committed prescription without its corresponding allergy check can be lethal. This scenario forces the strongest possible argument for ACID: when "eventually consistent" is medically unacceptable. It also illustrates why vertical scaling with a powerful relational instance often beats sharding when queries require cross-entity joins (patient → visits → prescriptions → drugs).

## Industry Problem 1 — Healthcare Records Requiring Strict ACID (Epic Scale)

**Problem:** A hospital information system manages electronic health records (EHR) for 10 million patients. A single patient visit may update allergies, prescriptions, lab orders, and billing in a single transaction. Partial updates are life-threatening — if a prescription is recorded but the allergy check is lost, the patient could receive a dangerous drug. Regulatory audits require full transaction history.

**Solution:**

```mermaid
graph TB
    subgraph ClientTier["Client Tier"]
        EHR_App[EHR Application<br/>HL7 FHIR API Gateway]
    end

    subgraph PrimaryRegion["Primary Region — us-east-1"]
        PgPrimary[(PostgreSQL 16 Primary<br/>db.r6g.8xlarge — 96 vCPU, 768GB RAM<br/>Serializable Isolation)]
        PgSync[(Sync Replica<br/>db.r6g.8xlarge — Same AZ<br/>Zero Data Loss Failover)]
        AuditLog[(Audit Log — PostgreSQL<br/>Append-Only, Immutable<br/>Logical Replication Subscriber)]
    end

    subgraph DRRegion["DR Region — us-west-2"]
        PgAsync[(Async Replica<br/>db.r6g.4xlarge<br/>RPO < 5 sec)]
    end

    EHR_App -->|"BEGIN SERIALIZABLE"| PgPrimary
    PgPrimary -->|"synchronous_commit = on"| PgSync
    PgPrimary -->|"streaming replication<br/>~200ms lag"| PgAsync
    PgPrimary -->|"logical replication<br/>WAL → audit"| AuditLog

    PgPrimary -->|"single ACID txn"| Visit[Visit Record<br/>FK → patient_id]
    PgPrimary -->|"single ACID txn"| Rx[Prescription<br/>FK → drug_id, allergy_check_id]
    PgPrimary -->|"single ACID txn"| Allergy[Allergy Check<br/>CHECK constraint on severity]
    PgPrimary -->|"single ACID txn"| Billing[Billing Entry<br/>FK → visit_id, insurance_id]
```

**How this solves the problem:** Wrapping all visit updates — allergies, prescriptions, labs, billing — in a single `SERIALIZABLE` transaction guarantees that either every change commits or none do; a failed allergy check rolls back the entire visit, preventing dangerous partial state. Synchronous replication to a same-AZ replica ensures zero data loss on primary failure, while the async DR replica in us-west-2 provides geographic disaster recovery with < 5-second RPO. The append-only audit log, fed by PostgreSQL logical replication, creates an immutable HIPAA-compliant trail of every row change without impacting primary write performance. Vertical scaling on a 96-vCPU instance avoids sharding, preserving the cross-patient joins needed for population health analytics.

**Key decisions:**

- **PostgreSQL with serializable isolation** — all visit updates are wrapped in a single ACID transaction. If the allergy check fails, the entire visit update rolls back. Zero tolerance for partial writes.
- **Append-only audit log** — every row change is captured via PostgreSQL logical replication into an immutable audit table. Meets HIPAA audit trail requirements.
- **Schema-on-write enforcement** — strict foreign keys and CHECK constraints prevent bad data at the database level. Unlike a document store, invalid data is rejected, not silently stored.
- **Vertical scaling first** — EHR workloads are join-heavy (patient → visits → prescriptions → drugs). A single powerful PostgreSQL instance (96 vCPUs, 768GB RAM) handles 10M patients. Sharding would break cross-patient queries needed for population health analytics.

---

**Why this example:** Gaming is the quintessential polyglot persistence scenario — a single application with three radically different data access patterns that no single database can serve well. Player inventory demands ACID (duplicating a rare sword breaks the economy), leaderboards demand sub-millisecond sorted-set operations at 500K writes/sec, and match history demands a flexible schema that evolves with every new game mode. This forces three databases to coexist under one application, making it the ideal case study for when and how to split data across stores.

## Industry Problem 2 — Gaming Platform with Player State and Leaderboards (Riot Games Scale)

**Problem:** A multiplayer game has 100M registered players. During peak, 8M are online simultaneously. Player state (inventory, XP, currency) requires strong consistency — duplicating a rare item would destroy the game economy. Leaderboards must update in real-time and handle 500K score writes/sec. Match history needs flexible schemas as game modes evolve quarterly.

**Solution:**

```mermaid
graph TB
    subgraph GameTier["Game Server Fleet — 2,000 instances"]
        GameServer[Game Servers<br/>Stateless, Region-Aware]
    end

    subgraph PlayerStore["Player State — ACID Required"]
        PlayerDB[(MySQL 8.0 InnoDB Cluster<br/>db.r6g.4xlarge × 3 nodes<br/>Group Replication)]
        PlayerDB -->|"SELECT ... FOR UPDATE<br/>row-level locks"| Inventory[Player Inventory<br/>idx: player_id, item_id<br/>Unique constraint on trades]
        PlayerDB -->|"ACID txn"| Currency[Currency & XP<br/>CHECK balance >= 0]
    end

    subgraph LeaderboardStore["Leaderboards — Sub-ms Latency"]
        Redis[(Redis 7.2 Cluster<br/>r7g.2xlarge × 6 shards<br/>Sorted Sets)]
        Redis -->|"ZADD O log N<br/>500K writes/sec"| LB[Global Leaderboard<br/>ZRANGEBYSCORE top-100 < 1ms]
        Redis -->|"per-region sorted sets"| RegionLB[Regional Leaderboards]
    end

    subgraph MatchStore["Match History — Flexible Schema"]
        MongoDB[(MongoDB 7.0<br/>M50 Atlas, 3-shard cluster<br/>shard key: player_id)]
        MongoDB -->|"schema-on-read<br/>new fields per game mode"| Matches[Match Replays & Stats<br/>100M+ docs, TTL index 2yr]
    end

    subgraph EventBus["Event Backbone"]
        Kafka[Apache Kafka<br/>12 brokers, 3-day retention]
    end

    subgraph AnalyticsTier["Analytics"]
        Analytics[Spark + ClickHouse<br/>Behavioral Analytics]
    end

    GameServer -->|"inventory trades, currency"| PlayerDB
    GameServer -->|"ZADD score updates"| Redis
    GameServer -->|"insertOne match doc"| MongoDB

    GameServer -->|"all game events"| Kafka
    Kafka -->|"CDC from all 3 stores"| Analytics
```

**How this solves the problem:** MySQL InnoDB with `SELECT ... FOR UPDATE` provides row-level locking on inventory rows, ensuring that concurrent item trades are serialized and a rare sword can never be duplicated — protecting the game economy with ACID guarantees. Redis Sorted Sets handle 500K leaderboard writes/sec via `ZADD` with O(log N) complexity across 6 shards, returning top-100 rankings in under 1ms — a latency target impossible to hit with a relational database doing `ORDER BY score LIMIT 100` under write contention. MongoDB's schema-on-read model absorbs quarterly game-mode changes (new fields, new stat shapes) without migration downtime, while its shard key on `player_id` distributes 100M+ match documents evenly. Kafka ties the three stores together, providing a unified event stream for analytics without coupling the game servers to the analytics pipeline.

**Key decisions:**

- **MySQL InnoDB for player state** — inventory trades and currency transfers require ACID transactions. `SELECT ... FOR UPDATE` locks prevent item duplication during concurrent trades.
- **Redis Sorted Sets for leaderboards** — `ZADD` handles 500K writes/sec with O(log N) complexity. `ZRANGEBYSCORE` returns top-100 in < 1ms. Redis is authoritative for rankings; MySQL is authoritative for player state.
- **MongoDB for match history** — match schemas change frequently (new game modes add fields). MongoDB's flexible document model avoids schema migrations. 100M+ match documents, queried by player_id (indexed).
- **Polyglot persistence** — three databases, each chosen for its strength. The game server orchestrates, and Kafka provides an event stream for analytics to consume from all three.

---

**Why this example:** Recommendation engines expose the exact weakness of relational databases — multi-hop relationship traversals. A 3-hop collaborative filtering query ("users who watched X also watched Y") requires 3 self-joins on a 50B-edge table, which takes minutes in SQL but milliseconds in a native graph database. This scenario demonstrates that data model shape (graph vs. table) matters more than raw performance tuning, and shows how graph databases complement — rather than replace — relational stores in a larger ML pipeline.

## Industry Problem 3 — Recommendation Engine with Graph Relationships (Netflix Scale)

**Problem:** A streaming platform serves 250M subscribers. The recommendation engine must traverse relationships: "users who watched X also watched Y," "movies with actor A in genre B," and "friends of user who liked Z." These are multi-hop graph traversals. Storing this in a relational database requires expensive self-joins on a table with 50B+ edges. Query latency must be < 200ms.

**Solution:**

```mermaid
graph LR
    subgraph RecoTier["Recommendation Service"]
        RecoSvc[Reco API<br/>gRPC, P99 < 200ms]
    end

    subgraph GraphLayer["Graph — Candidate Generation"]
        Neo4j[(Neo4j 5.x Enterprise<br/>3-node causal cluster<br/>r5.8xlarge, 256GB RAM<br/>50B edges in-memory)]
        Neo4j -->|"Cypher: 3-hop traversal<br/>MATCH u-WATCHED->Movie<br/><-WATCHED-sim-WATCHED->rec<br/>< 50ms, 500 candidates"| Candidates[Candidate Set<br/>~500 movies]
    end

    subgraph FeatureLayer["Feature Store — Pre-computed"]
        FeatureStore[(Redis 7.2 Cluster<br/>r7g.xlarge × 4 shards<br/>user embeddings, 128-dim vectors)]
    end

    subgraph MLLayer["ML Ranking"]
        MLModel[TensorFlow Serving<br/>Ranking Model<br/>scores 500 → top 50]
    end

    subgraph Ingestion["Data Ingestion Pipeline"]
        Kafka[Kafka — User Watch Events<br/>500K events/sec]
        ETL[Spark Batch ETL<br/>5-min micro-batches]
        Postgres[(PostgreSQL — Content Metadata<br/>movies, actors, genres<br/>source of truth)]
    end

    RecoSvc -->|"1. get candidates<br/>3-hop Cypher query"| Neo4j
    RecoSvc -->|"2. fetch features<br/>128-dim embeddings, < 2ms"| FeatureStore
    Candidates --> MLModel
    FeatureStore -->|"user + item features"| MLModel
    MLModel -->|"3. ranked list"| RecoSvc

    Kafka -->|"watch events"| ETL
    Postgres -->|"content metadata join"| ETL
    ETL -->|"MERGE nodes/edges<br/>5-min batches, ~2M edges/batch"| Neo4j
    ETL -->|"update embeddings"| FeatureStore
```

**How this solves the problem:** Neo4j's native graph storage represents the 50B user-movie-actor edges as adjacency lists, enabling a 3-hop Cypher traversal to return 500 collaborative-filtering candidates in under 50ms — the same query expressed as 3 self-joins in SQL would scan billions of rows and take minutes. Separating candidate generation (graph recall) from ranking (ML precision) means Neo4j only needs to find plausible candidates, while TensorFlow Serving scores and ranks them to the top 50, keeping end-to-end latency under 200ms at P99. The Redis feature store pre-computes 128-dimensional user embeddings, delivering them to the ML model in < 2ms and avoiding expensive feature computation at inference time. Batch ETL via Spark micro-batches (every 5 minutes) updates the graph from Kafka watch events and PostgreSQL content metadata, keeping the graph fresh without overwhelming Neo4j's write throughput with per-event updates.

**Key decisions:**

- **Neo4j for relationship traversal** — a Cypher query like `MATCH (u:User)-[:WATCHED]->(:Movie)<-[:WATCHED]-(similar:User)-[:WATCHED]->(rec:Movie) RETURN rec` finds collaborative-filtering candidates in < 50ms for 3-hop traversals. The same query in SQL requires 3 self-joins on a 50B-row table — minutes, not milliseconds.
- **Graph for candidate generation, ML for ranking** — Neo4j generates 500 candidates via graph traversal; the ML model scores and ranks them to 50. This separates recall (graph) from precision (ML).
- **Batch ETL updates the graph** — user watch events flow into Kafka → Spark → Neo4j in near-real-time (5-minute batches). The graph is not updated on every click — that would overwhelm write throughput.
- **Redis feature store for low-latency ML inference** — user features (watch history embedding, preferences) are pre-computed and cached in Redis. The ML model reads features in < 5ms.

---

## Comparison Summary

| Dimension          | SQL (PostgreSQL/MySQL)       | Document (MongoDB)                 | Wide-Column (Cassandra)          | Graph (Neo4j)                  |
| ------------------ | ---------------------------- | ---------------------------------- | -------------------------------- | ------------------------------ |
| **Schema**         | Rigid, enforced              | Flexible, schema-on-read           | Column families, semi-structured | Nodes, edges, properties       |
| **Transactions**   | Full ACID                    | Single-doc ACID, multi-doc limited | No multi-row transactions        | ACID within single graph       |
| **Scaling writes** | Vertical (or shard manually) | Built-in sharding                  | Peer-to-peer, linear scale       | Vertical; federation for scale |
| **Query power**    | SQL — joins, aggregations    | Rich query language, no joins      | Limited — primary key lookups    | Cypher — multi-hop traversals  |
| **Best for**       | OLTP, complex relationships  | Rapid prototyping, catalogs        | Time-series, IoT, high-write     | Social, fraud, recommendations |
| **Worst for**      | Massive write scale          | Complex multi-collection joins     | Ad-hoc queries, aggregations     | Tabular analytics, simple CRUD |

## Anti-Patterns

- **NoSQL because it's trendy:** Choosing MongoDB for a banking ledger because "NoSQL scales" ignores the need for multi-document ACID transactions.
- **SQL for everything:** Forcing a 50B-edge social graph into a relational schema results in queries that take minutes instead of milliseconds.
- **Ignoring polyglot persistence:** Using one database for all workloads means you optimize for none. It's fine to use 3 databases if each fits its workload.
- **Schema-on-read without validation:** "Flexible schema" doesn't mean "no schema." Without application-level validation, MongoDB collections drift into inconsistent shapes that break downstream consumers.

## Key Takeaway

> There is no universal best database. **SQL gives you correctness guarantees** (ACID, referential integrity) at the cost of scaling complexity. **NoSQL gives you scale and flexibility** at the cost of consistency and query power. Map each workload to the database whose strengths match its requirements — and don't be afraid to use more than one.
