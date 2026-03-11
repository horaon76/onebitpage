---
title: "Scalability"
category: "Fundamentals"
---

# Scalability

Scalability is a system's ability to handle growing amounts of work — more users, more data, more transactions — by adding resources rather than redesigning the architecture. A truly scalable system maintains its performance characteristics (latency, throughput, availability) as load increases by orders of magnitude. The two fundamental axes are **vertical scaling** (bigger machines) and **horizontal scaling** (more machines), but modern systems almost always rely on horizontal scaling because single-machine ceilings are real — you can't buy a server with 100TB of RAM or 10 million IOPS.

## Intent

- Grow capacity linearly (or better) with added resources: doubling servers should roughly double throughput.
- Avoid single points of failure that cap total system capacity.
- Enable independent scaling of different subsystems — the read path, write path, and background processing each have different bottlenecks.
- Support graceful degradation: when load exceeds capacity, shed load or queue work rather than crash.

## Architecture Overview

```mermaid
graph TB
    subgraph "Traffic Tier"
        DNS[DNS — Route53<br/>Geo-based routing]
        DNS --> GLB[Global Load Balancer<br/>Anycast IP]
    end

    subgraph "US-East Region"
        GLB -->|"~60% traffic"| LB1[ALB<br/>us-east-1]
        LB1 --> ASG1[Auto-Scaling Group<br/>c5.2xlarge × 12-48<br/>CPU target: 65%]
        ASG1 --> Cache1[Redis Cluster<br/>r6g.xlarge × 6 nodes<br/>3 masters + 3 replicas]
        ASG1 --> DB1[(Aurora MySQL<br/>Primary r5.4xlarge)]
        DB1 --> DB1R1[(Read Replica 1<br/>r5.2xlarge)]
        DB1 --> DB1R2[(Read Replica 2<br/>r5.2xlarge)]
    end

    subgraph "EU-West Region"
        GLB -->|"~25% traffic"| LB2[ALB<br/>eu-west-1]
        LB2 --> ASG2[Auto-Scaling Group<br/>c5.2xlarge × 6-24<br/>CPU target: 65%]
        ASG2 --> Cache2[Redis Cluster<br/>r6g.xlarge × 6 nodes]
        ASG2 --> DB2[(Aurora MySQL<br/>Read Replica<br/>Cross-Region)]
    end

    subgraph "AP-Southeast Region"
        GLB -->|"~15% traffic"| LB3[ALB<br/>ap-southeast-1]
        LB3 --> ASG3[Auto-Scaling Group<br/>c5.2xlarge × 4-16<br/>CPU target: 65%]
        ASG3 --> Cache3[Redis Cluster<br/>r6g.xlarge × 6 nodes]
        ASG3 --> DB3[(Aurora MySQL<br/>Read Replica<br/>Cross-Region)]
    end

    subgraph "Async Processing"
        ASG1 --> MQ[SQS / Kafka<br/>Async Work Queue]
        MQ --> Workers[Worker Fleet<br/>m5.xlarge × 8-32]
    end

    subgraph "Observability"
        HM[Health Monitor<br/>CloudWatch + Datadog]
        HM -.->|"CPU > 65% → scale out"| ASG1
        HM -.->|"CPU > 65% → scale out"| ASG2
        HM -.->|"CPU > 65% → scale out"| ASG3
        HM -.->|"queue depth > 10K → scale workers"| Workers
    end

    DB1 -->|"async replication<br/>~200ms lag"| DB2
    DB1 -->|"async replication<br/>~350ms lag"| DB3
```

## Key Concepts

### Vertical vs. Horizontal Scaling

| Dimension        | Vertical Scaling                        | Horizontal Scaling                                   |
| ---------------- | --------------------------------------- | ---------------------------------------------------- |
| **Approach**     | Upgrade to a bigger machine             | Add more machines of the same size                   |
| **Ceiling**      | Hard — largest EC2 is 24TB RAM, 448 CPU | Soft — add nodes until network or coordination limit |
| **Complexity**   | Low — no code changes                   | High — need partitioning, routing, consistency       |
| **Failure mode** | Single point of failure                 | Partial failure; system stays up                     |
| **Cost curve**   | Superlinear (2x CPU ≠ 2x cost)          | Near-linear                                          |
| **Downtime**     | Usually required for upgrade            | Zero-downtime rolling deploys                        |

### Scalability Dimensions

| What Scales          | Technique                                      | Example                            |
| -------------------- | ---------------------------------------------- | ---------------------------------- |
| **Compute**          | Horizontal auto-scaling behind a load balancer | Kubernetes HPA, AWS ASG            |
| **Read throughput**  | Read replicas, caching layers                  | Aurora replicas, Redis, Memcached  |
| **Write throughput** | Sharding, partitioning, event sourcing         | Vitess, DynamoDB, Kafka partitions |
| **Storage**          | Distributed storage, object stores             | S3, HDFS, Cassandra                |
| **Network**          | CDNs, edge computing, connection pooling       | CloudFront, Cloudflare Workers     |

### Scaling Metrics to Watch

| Metric              | Warning Threshold | Action                          |
| ------------------- | ----------------- | ------------------------------- |
| CPU utilization     | > 65% sustained   | Add instances / scale out       |
| Memory utilization  | > 80%             | Increase instance size or count |
| Request queue depth | > 10K pending     | Scale worker fleet              |
| P99 latency         | > 2× baseline     | Investigate bottleneck          |
| DB connections      | > 80% of pool max | Add read replicas or shard      |
| Disk IOPS           | > 70% provisioned | Move to faster storage tier     |

---

## Industry Problem 1 — E-Commerce Flash Sale (Amazon Prime Day Scale)

**Why this example:** Flash sales are the canonical test of elastic scalability because traffic spikes are extreme (10-100× normal), perfectly predictable in timing but not in magnitude, and the cost of failure is directly measured in lost revenue. This scenario uniquely tests both pre-scaling (capacity planning) and reactive auto-scaling under a sustained, hours-long surge — unlike a brief viral spike that CDNs can absorb.

**Problem:** An e-commerce platform averages 15K requests/sec on normal days but needs to handle 500K requests/sec during a 48-hour flash sale. The product catalog has 350M items. Inventory counts must be accurate to prevent overselling (no SOLD-OUT items showing as available). Cart and checkout must respond in under 200ms p99 even at peak. Last year's sale resulted in a 12-minute outage that cost $8M in lost sales.

**Solution:**

```mermaid
graph TB
    subgraph "Edge Tier"
        CF[CloudFront CDN<br/>400+ PoPs globally<br/>~80% cache hit ratio]
        WAF[AWS WAF<br/>Bot detection + rate limiting<br/>50K rule evaluations/sec]
        CF --> WAF
    end

    subgraph "US-East — Primary Region"
        WAF -->|"500K req/s peak"| ALB1[ALB<br/>us-east-1<br/>Cross-zone enabled]
        ALB1 --> CatalogASG[Catalog Service ASG<br/>c5.4xlarge × 20→200<br/>Pre-warmed 2hr before sale]
        ALB1 --> CartASG[Cart Service ASG<br/>c5.2xlarge × 10→80<br/>CPU target: 50%]
        ALB1 --> CheckoutASG[Checkout Service ASG<br/>c5.2xlarge × 10→60<br/>CPU target: 50%]

        CatalogASG --> CatalogCache[ElastiCache Redis Cluster<br/>r6g.2xlarge × 12 shards<br/>Product catalog cache<br/>95% hit rate]
        CatalogCache -.->|"cache miss<br/>~5%"| CatalogDB[(Aurora MySQL<br/>Catalog DB<br/>r5.8xlarge primary)]
        CatalogDB --> CatReplica1[(Read Replica 1)]
        CatalogDB --> CatReplica2[(Read Replica 2)]
        CatalogDB --> CatReplica3[(Read Replica 3)]

        CartASG --> CartStore[(DynamoDB<br/>Cart Table<br/>On-demand capacity<br/>Provisioned: 500K WCU)]

        CheckoutASG --> InventoryLock[Inventory Service<br/>Redis Lua Scripts<br/>Atomic Decrement]
        InventoryLock --> InventoryDB[(Aurora MySQL<br/>Inventory DB<br/>Serializable Isolation)]
        CheckoutASG --> OrderQueue[SQS FIFO Queue<br/>Order Processing<br/>Exactly-once delivery]
        OrderQueue --> OrderWorkers[Order Workers<br/>m5.2xlarge × 20→100]
    end

    subgraph "EU-West — Read Region"
        WAF -->|"~120K req/s"| ALB2[ALB<br/>eu-west-1]
        ALB2 --> EUCatalog[Catalog Service ASG<br/>c5.4xlarge × 8→60]
        EUCatalog --> EUCache[ElastiCache Redis<br/>r6g.2xlarge × 6 shards]
        EUCache -.-> CatalogDB
    end

    subgraph "Observability & Auto-Scaling"
        Dashboard[Datadog Dashboard<br/>Real-time metrics]
        Alarm[CloudWatch Alarms<br/>CPU, Latency, Queue Depth]
        Alarm -->|"P99 > 150ms"| ALB1
        Alarm -->|"queue depth > 5K"| OrderWorkers
        Dashboard -.-> CatalogASG
        Dashboard -.-> CartASG
        Dashboard -.-> CheckoutASG
    end

    InventoryDB -->|"async replication<br/>~100ms lag"| InventoryReplica[(Inventory Read Replica<br/>Analytics only)]
```

**How this solves the problem:** CloudFront absorbs 80% of catalog reads at the edge, reducing origin traffic from 500K to ~100K req/s hitting the application tier. Pre-warming the Auto-Scaling Groups 2 hours before the sale eliminates the cold-start latency that caused last year's outage — instances are already running and health-checked. The inventory service uses Redis Lua scripts for atomic stock decrements, guaranteeing that two concurrent buyers cannot purchase the last unit of the same item. DynamoDB's on-demand mode for the cart table means there's no provisioned throughput ceiling to hit during the spike. The SQS FIFO queue decouples checkout from order processing, so even if downstream payment systems slow down, the customer gets an immediate confirmation and the order is processed asynchronously.

**Key decisions:**

- **Pre-warming + aggressive auto-scaling** — ASGs are scaled to 60% of expected peak 2 hours before the sale, with reactive scaling handling the remaining surge. Target CPU is set to 50% (not the usual 70%) to leave headroom.
- **Separate scaling groups per service** — catalog is read-heavy and scales on request count; cart is session-heavy and scales on memory; checkout is CPU-bound and scales on CPU utilization.
- **Redis Lua for inventory atomicity** — `DECR` in a Lua script is atomic and sub-millisecond. The Aurora inventory DB is the source of truth but is only hit for reconciliation, not on the hot path.
- **DynamoDB for carts** — carts are ephemeral, high-churn, key-value access. DynamoDB handles 500K WCU without pre-provisioning, and abandoned carts auto-expire via TTL.

---

## Industry Problem 2 — Real-Time Analytics Pipeline (LinkedIn Scale)

**Why this example:** Analytics pipelines face a fundamentally different scaling challenge from request-serving systems: the bottleneck is sustained throughput over massive data volumes rather than latency on individual requests. LinkedIn's scale — billions of events per day from 900M members — forces you to solve event ordering, exactly-once processing, and backpressure simultaneously. This example illustrates how streaming architectures scale independently from the serving tier.

**Problem:** A professional network with 900M members generates 15B events/day (profile views, content impressions, job applications, searches, messages). Each event must be processed within 30 seconds for real-time dashboards (who viewed your profile, trending content) and also persisted for batch analytics. Event schema evolves weekly — new fields are added without breaking downstream consumers. During product launches, event volume can spike 3× within minutes.

**Solution:**

```mermaid
graph TB
    subgraph "Event Producers (US-East)"
        WebApp[Web Application<br/>c5.2xlarge × 200]
        MobileAPI[Mobile API<br/>c5.xlarge × 100]
        EmailSvc[Email Service<br/>m5.xlarge × 20]
    end

    subgraph "Ingestion Tier"
        WebApp -->|"~80K events/s"| Collector1[Event Collector 1<br/>Go service<br/>c5.xlarge]
        MobileAPI -->|"~50K events/s"| Collector2[Event Collector 2<br/>Go service<br/>c5.xlarge]
        EmailSvc -->|"~5K events/s"| Collector3[Event Collector 3<br/>Go service<br/>c5.xlarge]
        Collector1 & Collector2 & Collector3 --> SchemaReg[Schema Registry<br/>Confluent<br/>Avro validation]
    end

    subgraph "Kafka Cluster — US-East"
        SchemaReg --> KTopic1[Kafka Topic: page-views<br/>64 partitions<br/>Replication factor: 3]
        SchemaReg --> KTopic2[Kafka Topic: interactions<br/>32 partitions<br/>Replication factor: 3]
        SchemaReg --> KTopic3[Kafka Topic: searches<br/>16 partitions<br/>Replication factor: 3]
        Broker1[Broker 1<br/>i3.4xlarge<br/>24 NVMe disks] --- KTopic1
        Broker2[Broker 2<br/>i3.4xlarge] --- KTopic2
        Broker3[Broker 3<br/>i3.4xlarge] --- KTopic3
        BrokerN[... Broker 24<br/>i3.4xlarge] --- KTopic1
    end

    subgraph "Stream Processing"
        KTopic1 --> Flink1[Flink Job: Profile Views<br/>m5.2xlarge × 16<br/>Window: 10s tumbling]
        KTopic2 --> Flink2[Flink Job: Trending Content<br/>m5.2xlarge × 8<br/>Window: 60s sliding]
        KTopic3 --> Flink3[Flink Job: Search Analytics<br/>m5.xlarge × 4]
    end

    subgraph "Serving Layer"
        Flink1 -->|"~170K writes/s"| Redis1[Redis Cluster<br/>Profile View Counters<br/>r6g.xlarge × 6 shards]
        Flink2 -->|"~5K writes/s"| Redis2[Redis Cluster<br/>Trending Scores<br/>r6g.xlarge × 3 shards]
        Flink3 -->|"aggregated"| ESCluster[Elasticsearch<br/>Search Analytics<br/>m5.xlarge × 12 nodes]
    end

    subgraph "Batch / Cold Storage"
        KTopic1 & KTopic2 & KTopic3 --> S3Sink[Kafka Connect S3 Sink<br/>Parquet format<br/>Hourly partitions]
        S3Sink --> S3[(S3 Data Lake<br/>~2TB/day ingestion)]
        S3 --> Spark[Spark Jobs<br/>Daily aggregations<br/>EMR cluster<br/>r5.4xlarge × 20]
    end

    subgraph "Monitoring"
        Monitor[Kafka Monitor<br/>Burrow + Datadog]
        Monitor -.->|"consumer lag > 100K → alert"| Flink1
        Monitor -.->|"partition skew > 20% → rebalance"| KTopic1
    end

    subgraph "AP-Southeast Mirror"
        KTopic1 -->|"MirrorMaker 2<br/>async ~500ms"| APKafka[Kafka Mirror<br/>ap-southeast-1<br/>6 brokers]
        APKafka --> APFlink[Flink Jobs<br/>Local processing]
        APFlink --> APRedis[Redis Cluster<br/>Local serving]
    end
```

**How this solves the problem:** The Kafka cluster acts as a durable, ordered buffer that decouples producers from consumers — when event volume spikes 3×, Kafka absorbs the burst (with 7 days of retention) while Flink consumers catch up at their own pace. Partitioning topics by member_id ensures events for the same user are processed in order within a single Flink task, enabling accurate sessionization and deduplication. The schema registry enforces backward compatibility so new fields don't break existing consumers. The dual-path architecture — real-time via Flink-to-Redis, batch via S3-to-Spark — means dashboards update in seconds while historical analytics jobs run on cheap storage without competing for streaming resources.

**Key decisions:**

- **Kafka as the central nervous system** — 24 brokers on i3.4xlarge (NVMe-optimized) sustain 2GB/s aggregate write throughput with 3× replication. Topics are partitioned by member_id for ordering guarantees.
- **Schema Registry with Avro** — producers register schemas before publishing. Schema evolution rules (backward compatible only) are enforced at the registry level, preventing accidental breaking changes.
- **Flink per use case** — separate Flink jobs for profile views, trending, and search. Each job scales independently. Profile views need 16 task managers because it processes 10× more events/sec than trending.
- **MirrorMaker 2 for cross-region** — AP-Southeast gets a full mirror of Kafka topics with ~500ms lag. Local Flink jobs process events locally, keeping dashboard latency under 50ms for Asian users.
- **Backpressure-aware ingestion** — collectors check Kafka metadata before sending. If a partition's ISR count drops below 2, the collector buffers locally and switches to the next healthy partition.

---

## Industry Problem 3 — Global API Platform (Stripe / Twilio Scale)

**Why this example:** API platforms face a unique scaling challenge: every API call is a revenue event for both you and your customer, making reliability non-negotiable. Unlike internal services where you control the traffic shape, public APIs must handle arbitrary traffic patterns from millions of external developers — sudden onboarding of a large customer can 10× traffic to a single endpoint overnight. This scenario tests rate limiting, multi-tenancy isolation, and global latency simultaneously.

**Problem:** A developer API platform serves 50M API calls/day from 500K developer accounts across 190 countries. P99 latency must be under 100ms regardless of the caller's location. The platform must enforce per-customer rate limits (ranging from 25 req/s for free tier to 10K req/s for enterprise), provide five-nines availability (99.999% = 5 minutes downtime/year), and deploy updates multiple times per day without any API downtime.

**Solution:**

```mermaid
graph TB
    subgraph "Global Edge — Anycast"
        EdgeUS[Edge PoP US<br/>Cloudflare Workers<br/>Auth + Rate Limit<br/>~20M req/day]
        EdgeEU[Edge PoP EU<br/>Cloudflare Workers<br/>Auth + Rate Limit<br/>~18M req/day]
        EdgeAP[Edge PoP AP<br/>Cloudflare Workers<br/>Auth + Rate Limit<br/>~12M req/day]
    end

    subgraph "US-East — Primary Region"
        EdgeUS -->|"~230 req/s"| APIGW1[API Gateway<br/>Kong<br/>c5.4xlarge × 6]
        APIGW1 --> RateLimit1[Rate Limiter<br/>Redis Cluster<br/>Token Bucket per API key<br/>r6g.xlarge × 3 shards]
        APIGW1 --> AuthSvc1[Auth Service<br/>JWT validation<br/>c5.xlarge × 4]
        APIGW1 --> CoreAPI1[Core API Service<br/>c5.2xlarge × 12-48<br/>Canary deploys]
        CoreAPI1 --> PrimaryDB[(Aurora PostgreSQL<br/>Primary<br/>r5.4xlarge<br/>Multi-AZ)]
        PrimaryDB --> USReplica1[(Read Replica 1<br/>r5.2xlarge)]
        PrimaryDB --> USReplica2[(Read Replica 2<br/>r5.2xlarge)]
        CoreAPI1 --> EventBus[Kafka<br/>Event Bus<br/>Webhooks + Audit Logs]
        EventBus --> WebhookWorkers[Webhook Delivery<br/>m5.xlarge × 8<br/>Retry with exponential backoff]
    end

    subgraph "EU-West — Active Region"
        EdgeEU -->|"~210 req/s"| APIGW2[API Gateway<br/>Kong<br/>c5.4xlarge × 4]
        APIGW2 --> RateLimit2[Rate Limiter<br/>Redis Cluster<br/>r6g.xlarge × 3 shards]
        APIGW2 --> CoreAPI2[Core API Service<br/>c5.2xlarge × 8-32]
        CoreAPI2 --> EUDB[(Aurora PostgreSQL<br/>Global Database<br/>Read-write forwarding)]
    end

    subgraph "AP-Southeast — Active Region"
        EdgeAP -->|"~140 req/s"| APIGW3[API Gateway<br/>Kong<br/>c5.4xlarge × 3]
        APIGW3 --> RateLimit3[Rate Limiter<br/>Redis Cluster<br/>r6g.xlarge × 3 shards]
        APIGW3 --> CoreAPI3[Core API Service<br/>c5.2xlarge × 6-20]
        CoreAPI3 --> APDB[(Aurora PostgreSQL<br/>Global Database<br/>Read-write forwarding)]
    end

    subgraph "Health & Deployment"
        HealthCheck[Health Checker<br/>Synthetic API calls<br/>Every 10s from 20 PoPs]
        HealthCheck -.->|"3 consecutive failures → failover"| APIGW1
        HealthCheck -.->|"3 consecutive failures → failover"| APIGW2
        HealthCheck -.->|"3 consecutive failures → failover"| APIGW3
        Deployer[Deploy Pipeline<br/>Canary → 5% → 25% → 100%<br/>Auto-rollback on P99 spike]
        Deployer -.-> CoreAPI1
        Deployer -.-> CoreAPI2
        Deployer -.-> CoreAPI3
    end

    PrimaryDB -->|"async replication<br/>~120ms lag"| EUDB
    PrimaryDB -->|"async replication<br/>~280ms lag"| APDB

    RateLimit1 -.->|"sync rate limit state<br/>every 1s"| RateLimit2
    RateLimit1 -.->|"sync rate limit state<br/>every 1s"| RateLimit3
```

**How this solves the problem:** Edge PoPs handle authentication and rate limiting within 5ms of the user, rejecting bad traffic before it reaches the origin — this alone drops P99 from 200ms to under 80ms for most callers. Aurora Global Database enables read-write forwarding so EU and AP regions can handle both reads and writes without routing to US-East, achieving sub-100ms latency in all three regions. The rate limiter uses a distributed token bucket: each region maintains local counters in Redis and syncs consumed tokens globally every second, which means a customer can't exceed their limit by spraying requests across regions. Canary deployments roll out to 5% of traffic first, with automatic rollback if P99 latency increases by more than 20% — this enables multiple deploys per day without risking availability.

**Key decisions:**

- **Edge-first architecture** — Cloudflare Workers at 300+ PoPs parse the API key, check a local rate-limit cache, and reject unauthorized or over-limit requests in <5ms. Only valid, within-limit requests reach the origin.
- **Distributed rate limiting with global sync** — each region's Redis cluster tracks per-key consumption locally. Every 1 second, a background process syncs consumed counts across regions. This allows slight over-limit bursts (up to 3× the 1-second window) but prevents sustained abuse.
- **Aurora Global Database** — a single primary in US-East with read-write forwarding to EU-West and AP-Southeast. Reads are local (sub-10ms); writes forward to the primary (~120-280ms) but the caller gets a response immediately with eventual consistency.
- **Canary deploys with automated rollback** — every deployment goes through 5% → 25% → 100% stages. At each stage, the deploy pipeline compares error rate and P99 latency against the baseline. A >20% regression triggers automatic rollback within 60 seconds.
- **Webhook delivery with retry** — API events are published to Kafka and delivered to customer webhook endpoints with exponential backoff (up to 72 hours of retries). Failed deliveries are surfaced in the developer dashboard.

---

## Scaling Patterns Summary

| Pattern                     | Description                                               | When to Use                                 |
| --------------------------- | --------------------------------------------------------- | ------------------------------------------- |
| **Horizontal auto-scaling** | Add/remove instances based on metrics                     | Stateless services with variable load       |
| **Read replicas**           | Replicate data to serve reads from multiple nodes         | Read-heavy workloads (>10:1 read-write)     |
| **Sharding**                | Split data across independent partitions                  | Write-heavy workloads exceeding single-node |
| **CQRS**                    | Separate read and write models for independent scaling    | Systems where read/write patterns diverge   |
| **Event-driven / async**    | Decouple producers from consumers via queues or streams   | Spiky workloads, long-running processing    |
| **Edge computing**          | Push computation to edge PoPs near users                  | Latency-sensitive global APIs               |
| **Pre-warming**             | Provision capacity ahead of known traffic spikes          | Predictable events (sales, launches)        |
| **Backpressure**            | Signal upstream to slow down when downstream is saturated | Streaming pipelines, queue-based systems    |

## Anti-Patterns

- **Scaling everything together:** If you have one monolith, a spike in the chat feature forces you to scale your billing code too. Decompose services so each scales independently on its own bottleneck.
- **Ignoring the database:** You can auto-scale to 1,000 app servers, but if they all hit a single database, you've just moved the bottleneck. Scale the data tier (replicas, sharding, caching) before scaling compute.
- **Reactive-only scaling:** Auto-scaling has a 2-5 minute lag (launch, boot, health check). For predictable traffic spikes, pre-warm capacity — don't rely solely on reactive policies.
- **Premature distribution:** Adding Kafka, Redis, and three microservices to handle 100 req/s is over-engineering. Start with a single server and a managed database; scale when metrics demand it.
- **Ignoring cost:** Scaling to handle a 1-hour daily peak by keeping peak capacity 24/7 wastes 90% of spend. Use scheduled scaling, spot instances, and serverless for variable workloads.

## Key Takeaway

> Scalability is not a single technique — it's a **layered strategy** where each tier (edge, compute, cache, database, async processing) scales independently using the right pattern. Start simple (vertical scaling, read replicas), add complexity only when metrics prove you need it, and always scale the data tier alongside the compute tier. The best architectures scale linearly with resources and degrade gracefully when they can't.
