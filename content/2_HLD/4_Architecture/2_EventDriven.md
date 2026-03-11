---
title: "Event-Driven Architecture"
category: "Architecture Patterns"
---

# Event-Driven Architecture

Event-Driven Architecture (EDA) structures systems around the production, detection, and reaction to events—immutable facts about something that happened. Instead of services calling each other directly, producers emit events and consumers react asynchronously. This inverts coupling: producers don't know who consumes their events, enabling systems that scale horizontally, degrade gracefully, and evolve without coordinated deployments.

## Intent

- **Temporal decoupling**: Producers and consumers don't need to be available simultaneously—events are buffered in brokers, enabling resilience to downstream failures and traffic spikes.
- **Fan-out without coordination**: A single event (e.g., "OrderPlaced") can trigger warehouse fulfillment, email notification, analytics, and fraud checks—all without the order service knowing about any of them.
- **Audit and replay**: An immutable event log serves as a system-of-record, enabling replay for debugging, rebuilding read models, or migrating to new consumers.

## Architecture Overview

```mermaid
graph LR
    subgraph Producers
        P1[Order Service<br/>Java / Spring Boot<br/>12 instances]
        P2[Payment Service<br/>Go / gRPC<br/>8 instances]
        P3[Inventory Service<br/>Node.js<br/>6 instances]
    end

    subgraph Kafka Cluster ["Kafka Cluster (3 brokers, us-east-1)"]
        SR[Schema Registry<br/>Confluent / Avro]
        T1[orders topic<br/>12 partitions, 7d retention]
        T2[payments topic<br/>8 partitions, 14d retention]
        T3[inventory topic<br/>6 partitions, 3d retention]
    end

    subgraph Consumers
        C1[Warehouse Service<br/>Java / Spring Boot]
        C2[Notification Service<br/>Python / Celery]
        C3[Analytics Pipeline<br/>Apache Flink]
        C4[Fraud Detection<br/>Flink + TensorFlow]
    end

    P1 -->|"OrderPlaced | 5K events/sec"| T1
    P2 -->|"PaymentProcessed | 3K events/sec"| T2
    P3 -->|"StockUpdated | 1K events/sec"| T3
    P1 -.->|validate schema| SR
    P2 -.->|validate schema| SR

    T1 --> C1
    T1 --> C2
    T1 --> C3
    T2 --> C4
    T3 --> C3

    C3 --> DW[(Data Warehouse<br/>Snowflake)]
    C4 --> Alert[Alert System<br/>PagerDuty]
    T1 --> DLQ[Dead Letter Queue<br/>orders.dlq topic<br/>30d retention]
    T2 --> DLQ2[Dead Letter Queue<br/>payments.dlq topic<br/>30d retention]

    style SR fill:#ffca28,color:#000
    style T1 fill:#42a5f5,color:#000
    style T2 fill:#42a5f5,color:#000
    style T3 fill:#42a5f5,color:#000
    style C4 fill:#ef5350,color:#fff
    style DLQ fill:#ff8a65,color:#000
    style DLQ2 fill:#ff8a65,color:#000
```

**How this solves the problem:** The architecture overview shows a canonical three-layer EDA: typed producers, a partitioned Kafka broker cluster with schema governance, and independently deployable consumers. The schema registry enforces Avro contracts at the producer boundary, preventing malformed events from ever entering the system. Each topic's partition count and retention are tuned to its throughput and replay requirements—orders retain 7 days for consumer catch-up, while inventory keeps only 3 days since stock snapshots are disposable. Dead letter queues on critical topics ensure poison-pill messages are isolated without blocking healthy event flow.

## Key Concepts

### Messaging Patterns

| Pattern               | Delivery                    | Use Case                     | Example Broker                |
| --------------------- | --------------------------- | ---------------------------- | ----------------------------- |
| Pub/Sub               | Fan-out to all subscribers  | Notifications, analytics     | Kafka topics, SNS             |
| Point-to-Point        | Single consumer per message | Task processing, commands    | SQS, RabbitMQ queues          |
| Event Streaming       | Ordered, replayable log     | Audit trails, event sourcing | Kafka, Kinesis, Pulsar        |
| Request-Reply (async) | Correlated response         | Saga orchestration           | RabbitMQ with correlation IDs |

### Broker Comparison

| Feature    | Kafka                     | RabbitMQ         | SQS                           |
| ---------- | ------------------------- | ---------------- | ----------------------------- |
| Throughput | 1M+ msgs/sec              | 50K msgs/sec     | 3K msgs/sec (standard)        |
| Ordering   | Per-partition             | Per-queue        | Best-effort (FIFO: per-group) |
| Retention  | Days/weeks (configurable) | Until consumed   | 14 days max                   |
| Replay     | Yes (offset-based)        | No               | No                            |
| Ideal for  | Streaming, event sourcing | Task queues, RPC | Serverless, simple decoupling |

### Event Schema Evolution

Events are contracts. Use a schema registry (Confluent, AWS Glue) with **backward-compatible** evolution: add optional fields, never remove or rename required fields. Version events explicitly (`OrderPlacedV2`) when breaking changes are unavoidable.

---

**Why this example:** Real-time fraud detection is the quintessential "event-driven or nothing" problem—synchronous inline checks penalize every transaction with latency, but fraud windows close in milliseconds. This scenario uniquely illustrates the **optimistic acceptance** pattern, where the system returns success before validation completes, and the tension between latency SLAs and accuracy that only async event processing can resolve.

## Industry Problem 1: Real-Time Fraud Detection at 10K TPS

```mermaid
sequenceDiagram
    participant POS as Payment Terminal<br/>(40 countries)
    participant PS as Payment Service<br/>(Go, 20 instances)
    participant SR as Schema Registry<br/>(Confluent)
    participant Kafka as Kafka (txn-events)<br/>64 partitions, 30d retention<br/>key: card_id
    participant DLQ as Dead Letter Queue<br/>(txn-events.dlq, 90d)
    participant FD as Fraud Detection<br/>(Flink 16 TaskManagers)<br/>checkpoint: 10s
    participant Redis as Redis Cluster<br/>(User History Cache)
    participant ML as ML Model Sidecar<br/>(TensorFlow Serving)
    participant KafkaOut as Kafka (fraud-alerts)<br/>8 partitions, 14d retention
    participant Alert as Alert Service<br/>(PagerDuty + Card Block API)
    participant PS2 as Payment Reversal Handler

    POS->>PS: Process Payment ($142.50)
    PS->>SR: Validate TransactionCreated schema (Avro)
    PS->>Kafka: TransactionCreated event |10K events/sec|
    PS-->>POS: HTTP 202 Accepted (optimistic, p99 45ms)
    Kafka->>FD: Consume event |partition key: card_id| (p99 < 50ms)
    FD->>Redis: Fetch 30-day velocity for card_id
    Redis-->>FD: 47 txns, 3 countries, $12,400 total
    FD->>ML: Score transaction (feature vector)
    ML-->>FD: Risk score 0.87 (threshold: 0.80)
    FD->>KafkaOut: FraudSuspected event |500 events/sec|
    FD--xDLQ: Malformed events (0.02% rate)
    KafkaOut->>Alert: Block card + notify customer
    KafkaOut->>PS2: Reverse transaction (compensating event)
```

**How this solves the problem:** The architecture separates the latency-critical payment acceptance path from the compute-heavy fraud analysis. By emitting `TransactionCreated` events to a 64-partition Kafka topic keyed on `card_id`, the system guarantees in-order processing per card while distributing load across 16 Flink TaskManagers. The Redis sidecar lookup and ML inference happen entirely within the streaming pipeline—no synchronous network hops back to the payment service. Suspected fraud produces a downstream event that triggers card blocking and transaction reversal independently, keeping the reversal rate at 0.3% while maintaining sub-50ms consumer latency.

**Problem**: A payment processor handles 10,000 transactions/second across 40 countries. Fraud must be detected within 500ms to block the transaction before settlement. A synchronous fraud check in the payment path adds 200ms latency to every transaction—including the 99.7% that are legitimate. False positive rate must stay below 0.1% to avoid blocking valid customers.

**Solution**: Payment service emits `TransactionCreated` events to Kafka and returns an optimistic acceptance. A Flink streaming job consumes events with p99 latency under 50ms, enriches them with user history from a Redis cache, and scores via an ML model. High-risk transactions (score > 0.8) produce `FraudSuspected` events consumed by the alert service and payment reversal handler. Legitimate transactions flow through untouched—zero added latency for good payments.

**Key decisions**:

- **Optimistic acceptance** trades a small reversal rate (0.3%) for eliminating latency from the happy path
- Kafka partitioned by `card_id` ensures all events for a card arrive in order—critical for velocity checks
- ML model runs in a **sidecar** co-located with Flink workers—network hop eliminated, inference at 2ms p99
- 30-day event retention enables fraud analysts to replay and backtest new detection rules

---

**Why this example:** IoT telemetry is the highest-throughput event-driven workload most engineers will encounter, with sustained millions of events per second from unreliable producers on constrained networks. This scenario illustrates the **Lambda architecture split** (hot/warm/cold paths), where a single event stream must serve consumers with latency requirements spanning three orders of magnitude—from 2-second alerts to month-old batch analytics—while keeping storage costs sustainable.

## Industry Problem 2: IoT Sensor Data Pipeline from 1M Devices

```mermaid
graph TB
    subgraph Edge ["Edge Layer (Factory Floor)"]
        Devices[1M IoT Devices<br/>MQTT → Kafka Bridge<br/>1 msg/sec each]
    end

    subgraph Ingestion ["Kafka Cluster (5 brokers, us-east-1 + us-west-2)"]
        KafkaIn[sensor-telemetry topic<br/>50 partitions, 72h retention<br/>key: sensor_id<br/>replication factor: 3]
        SR[Schema Registry<br/>AWS Glue / Avro]
        DLQ[Dead Letter Queue<br/>sensor-telemetry.dlq<br/>30d retention]
    end

    subgraph Processing ["Stream Processing (Flink Cluster, 24 TaskManagers)"]
        Dedup[Dedup & Validate<br/>Flink Job<br/>checkpoint: 30s<br/>RocksDB state backend]
    end

    subgraph HotPath ["Hot Path (Real-Time Alerts)"]
        Hot[Threshold Breach Filter<br/>Flink CEP<br/>pattern: temp > 95°C for 3 readings]
        Alert[Alert Service<br/>PagerDuty + OpsGenie<br/>p99 < 2s]
    end

    subgraph WarmPath ["Warm Path (Operational Dashboards)"]
        Warm[5-min Tumbling Window<br/>Flink Aggregation<br/>avg, min, max, p99]
        TS[(TimescaleDB<br/>90d retention<br/>Grafana dashboards)]
    end

    subgraph ColdPath ["Cold Path (Historical Archive)"]
        Cold[15-min Micro-Batch<br/>Kafka Connect S3 Sink<br/>Parquet + Snappy compression]
        Lake[(S3 Data Lake<br/>partitioned: year/month/day/hour<br/>$0.023/GB)]
        Athena[Amazon Athena<br/>Ad-hoc historical queries]
    end

    Devices -->|"1M events/sec sustained<br/>3M peak (shift change)"| KafkaIn
    Devices -.->|"malformed ~0.2%"| DLQ
    KafkaIn --> Dedup
    Dedup -->|"900K events/sec (after dedup)"| Hot
    Dedup -->|"900K events/sec"| Warm
    Dedup -->|"900K events/sec"| Cold

    Hot -->|"~200 alerts/min"| Alert
    Warm -->|"300x write reduction"| TS
    Cold -->|"Parquet batches every 15 min"| Lake
    Lake --> Athena

    style KafkaIn fill:#42a5f5,color:#000
    style SR fill:#ffca28,color:#000
    style Hot fill:#ef5350,color:#fff
    style Cold fill:#90caf9,color:#000
    style DLQ fill:#ff8a65,color:#000
    style Dedup fill:#ab47bc,color:#fff
```

**How this solves the problem:** The three-path architecture lets a single Kafka topic serve consumers with radically different latency and cost profiles. After deduplication removes sensor retries (~10% of traffic), Flink CEP on the hot path matches complex patterns (e.g., three consecutive overheating readings) and fires alerts within 2 seconds. The warm path's 5-minute tumbling windows reduce write volume 300x before hitting TimescaleDB, making dashboards affordable at scale. The cold path uses Kafka Connect's S3 sink with Parquet compression, storing raw telemetry at $0.023/GB—three orders of magnitude cheaper than database writes. The dead letter queue isolates the 0.2% of malformed events, preventing a single broken sensor from poisoning the entire pipeline.

**Problem**: An industrial IoT platform ingests telemetry from 1 million sensors at 1 message/second each—1M events/sec sustained, spiking to 3M during shift changes. Data must serve three consumers with different latency requirements: real-time alerts (< 2s), operational dashboards (5-min granularity), and historical analytics (batch). Storing raw events naively would cost $50K/month in database writes alone.

**Solution**: Kafka ingestion layer with 50 partitions handles 1M msgs/sec at 60% capacity (headroom for spikes). A Flink streaming job deduplicates (sensor retries), validates schemas, and routes events to three paths: (1) Hot path filters threshold breaches and emits alerts within 2s. (2) Warm path aggregates 5-minute windows to TimescaleDB for dashboards—reducing write volume 300x. (3) Cold path batches to S3 in Parquet format every 15 minutes for pennies/GB storage. Malformed events route to a dead letter queue for debugging.

**Key decisions**:

- **Lambda architecture** (hot + cold) chosen over pure streaming because historical queries need cost-efficient batch storage
- Kafka retention set to 72 hours—enough to replay and rebuild any downstream consumer without permanent storage cost
- Sensor ID as partition key ensures ordering per device; 50 partitions balance parallelism vs. overhead
- Dead letter queue captures ~0.2% of events—schema validation prevents poison pills from crashing pipelines

---

**Why this example:** Order fulfillment is the classic fan-out problem where a single business event must trigger N independent downstream reactions. This scenario was chosen because it clearly demonstrates the coupling inversion that defines EDA—going from a fragile 2.5-second synchronous chain where any service failure blocks orders, to a topology where the order service has zero knowledge of its consumers and new services attach without any producer changes.

## Industry Problem 3: Order Fulfillment Fan-Out

```mermaid
graph TB
    subgraph Producer ["Order Service (Java / Spring Boot, 10 instances)"]
        OS[Order API<br/>POST /orders<br/>p99: 150ms]
    end

    subgraph KafkaCluster ["Kafka Cluster (3 brokers, replication factor 3)"]
        SR[Schema Registry<br/>Confluent / Avro<br/>compatibility: BACKWARD]
        T1[orders topic<br/>12 partitions, 7d retention<br/>key: order_id]
        T2[fulfillment-events topic<br/>8 partitions, 7d retention]
        DLQ[orders.dlq topic<br/>30d retention<br/>retry policy: 3 attempts, exponential backoff]
    end

    subgraph ConsumerGroups ["Consumer Groups (independent offsets)"]
        WH[Warehouse Service<br/>Java, 4 instances<br/>group: warehouse-cg]
        NS[Notification Service<br/>Python / Celery, 3 instances<br/>group: notifications-cg]
        AN[Analytics Service<br/>Flink, 2 TaskManagers<br/>group: analytics-cg]
        INV[Inventory Service<br/>Go, 3 instances<br/>group: inventory-cg]
        LP[Loyalty Service<br/>Node.js, 2 instances<br/>group: loyalty-cg]
    end

    OS -->|"OrderPlaced | 50K orders/day<br/>~580 events/sec peak"| T1
    OS -.->|validate schema| SR

    T1 -->|"consumer group: warehouse-cg"| WH
    T1 -->|"consumer group: notifications-cg"| NS
    T1 -->|"consumer group: analytics-cg"| AN
    T1 -->|"consumer group: inventory-cg"| INV
    T1 -->|"consumer group: loyalty-cg"| LP
    T1 -.->|"failed after 3 retries"| DLQ

    WH -->|"OrderShipped | partition key: order_id"| T2
    INV -->|"StockDepleted | partition key: sku_id"| T2

    T2 -->|"fan-out on fulfillment events"| NS
    T2 -->|"fan-out on fulfillment events"| AN

    style T1 fill:#42a5f5,color:#000
    style T2 fill:#42a5f5,color:#000
    style SR fill:#ffca28,color:#000
    style OS fill:#66bb6a,color:#000
    style DLQ fill:#ff8a65,color:#000
    style LP fill:#ce93d8,color:#000
```

**How this solves the problem:** Each downstream service operates in its own Kafka consumer group, meaning every service independently tracks its offset and processes every `OrderPlaced` event at its own pace. When the loyalty service goes down, it simply stops committing offsets—Kafka retains events for 7 days, and the service replays missed events on recovery with no data loss. The order API's only responsibility is a database write and a Kafka produce, keeping latency at 150ms instead of the original 2.5 seconds. Secondary fan-out on the `fulfillment-events` topic lets `OrderShipped` and `StockDepleted` events trigger notifications and analytics updates without any coupling back to the warehouse or inventory services. The dead letter queue with exponential backoff retry (3 attempts) prevents transient failures from losing events while isolating persistent failures for manual inspection.

**Problem**: An e-commerce platform processes 50K orders/day. When an order is placed, 5 downstream systems must react: warehouse (pick/pack), notifications (confirmation email), analytics (revenue), inventory (stock deduction), and loyalty (points). In the original synchronous design, the order API calls all 5 services sequentially—API latency climbed to 2.5s, and if the loyalty service went down, orders failed entirely.

**Solution**: The order service publishes a single `OrderPlaced` event to Kafka. Each downstream service consumes independently with its own consumer group—adding a new consumer (e.g., loyalty) requires zero changes to the order service. Each consumer manages its own offset, retry logic, and failure handling. The warehouse service emits `OrderShipped` events, which trigger another fan-out to notifications and analytics. Total coupling: the order service knows about exactly zero downstream consumers.

**Key decisions**:

- **Consumer groups** ensure each service processes every event exactly once (at-least-once with idempotency)
- Order API latency dropped from 2.5s to 150ms—just a DB write and Kafka produce
- Loyalty service outage no longer affects order placement—it catches up when restored (Kafka retention: 7 days)
- Schema registry enforces `OrderPlaced` contract—producers can't break consumers by changing field types
- Added a **compensating event** pattern: `OrderCancelled` triggers reverse operations in all consumers

---

## Anti-Patterns

| Anti-Pattern                  | Description                                                                              | Consequence                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Event Soup**                | Hundreds of fine-grained events with no clear domain meaning                             | Impossible to reason about system behavior; debugging nightmare |
| **Event as Command**          | Using events to tell services what to do ("SendEmail") vs. what happened ("OrderPlaced") | Tight coupling disguised as async; defeats the purpose of EDA   |
| **No Schema Governance**      | Events evolve without registry or versioning                                             | Consumer breakage on every producer deploy                      |
| **Missing Dead Letter Queue** | No handling for poison-pill messages                                                     | One bad event blocks an entire partition/queue permanently      |
| **Ignoring Ordering**         | Assuming events arrive in order across partitions                                        | Race conditions: "OrderShipped" processed before "OrderPlaced"  |

---

> **Key Takeaway**: Event-driven architecture shines when you need to decouple producers from an evolving set of consumers, or when you need to absorb traffic spikes without back-pressure on the source. The key cost is **eventual consistency**—if your business domain can't tolerate even seconds of stale data between services, synchronous calls may be simpler and more correct. Choose events for fan-out and resilience, not because async sounds modern.
