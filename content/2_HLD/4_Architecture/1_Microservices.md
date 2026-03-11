---
title: "Microservices Architecture"
category: "Architecture Patterns"
---

# Microservices Architecture

Microservices decompose a system into small, independently deployable services aligned with business domains. Each service owns its data, communicates over well-defined APIs, and can be developed, scaled, and released by autonomous teams. The approach trades operational simplicity for organizational scalability—enabling hundreds of teams to ship in parallel without stepping on each other.

## Intent

- **Domain isolation**: Align service boundaries with bounded contexts so each team owns a clear slice of business logic and data, reducing cross-team coordination overhead.
- **Independent deployment**: Ship any service without redeploying the entire system—enabling 100+ deploys/day at organizations like Netflix and Amazon.
- **Selective scaling**: Scale hot services (checkout, search) independently of cold ones (admin, reporting), optimizing infrastructure cost by 30-60%.

## Architecture Overview

```mermaid
graph TB
    subgraph K8s["Kubernetes Cluster — us-east-1"]
        Kong[Kong API Gateway<br/>Rate Limit · JWT · 3 replicas]
        subgraph Mesh["Istio Service Mesh"]
            Auth[Auth Service · Go · 4 replicas]
            AuthEP{{Envoy · mTLS · Retry 3x}}
            Catalog[Catalog Service · Java · 8 replicas]
            CatEP{{Envoy · Circuit Breaker}}
            Cart[Cart Service · Node.js · 6 replicas]
            CartEP{{Envoy · Timeout 500ms}}
            Order[Order Service · Java · 5 replicas]
            OrdEP{{Envoy · Retry 2x · CB}}
            Payment[Payment Service · Go · 4 replicas]
            PayEP{{Envoy · mTLS · Timeout 2s}}
        end
        subgraph Data["Database-per-Service"]
            CatalogDB[(PostgreSQL 15 · 3-node HA)]
            CartDB[(Redis Cluster · 6 shards)]
            OrderDB[(MySQL 8 · Primary-Replica)]
            PaymentDB[(PostgreSQL 15 · Encrypted)]
        end
        Kafka[Apache Kafka · 3 brokers · 12 partitions]
    end

    Client[Client Apps] -->|HTTPS ~40ms p50| Kong
    Kong -->|gRPC 2ms| Auth --- AuthEP
    Kong -->|REST 8ms| Catalog --- CatEP
    Kong -->|REST 5ms| Cart --- CartEP
    Kong -->|REST 12ms| Order --- OrdEP
    Kong -->|gRPC 3ms| Payment --- PayEP
    Catalog --> CatalogDB
    Cart --> CartDB
    Order --> OrderDB
    Payment --> PaymentDB
    Order -->|Kafka async · OrderPlaced| Kafka
    Payment -->|Kafka async · PaymentProcessed| Kafka
    Kafka --> Notify[Notification Svc · Python · 3 replicas]
    Kafka --> Analytics[Analytics Svc · Python · 3 replicas]

    style Kong fill:#f9a825,color:#000
    style Kafka fill:#42a5f5,color:#000
    style AuthEP fill:#ce93d8,color:#000
    style CatEP fill:#ce93d8,color:#000
    style CartEP fill:#ce93d8,color:#000
    style OrdEP fill:#ce93d8,color:#000
    style PayEP fill:#ce93d8,color:#000
```

## Key Concepts

### Communication Patterns

| Pattern                 | Latency   | Coupling              | Use Case                                 |
| ----------------------- | --------- | --------------------- | ---------------------------------------- |
| REST/HTTP               | ~5-50ms   | Higher (sync)         | CRUD operations, simple queries          |
| gRPC                    | ~1-10ms   | Medium (sync, schema) | Internal service-to-service, low latency |
| Async Messaging         | ~50-500ms | Lower (decoupled)     | Events, notifications, workflows         |
| Event Streaming (Kafka) | ~10-100ms | Lowest                | Real-time pipelines, audit logs          |

### Data Ownership Principles

Each service owns its database exclusively. No service reads another service's tables directly. Data is shared through APIs or events. This means accepting **eventual consistency** across service boundaries—a trade-off that enables independent deployability.

### Bounded Context Mapping

| DDD Concept           | Microservice Equivalent         |
| --------------------- | ------------------------------- |
| Bounded Context       | Service boundary                |
| Aggregate Root        | Primary entity within a service |
| Domain Event          | Async message between services  |
| Anti-Corruption Layer | API adapter / translator        |

---

## Industry Problem 1: Monolith Decomposition at Netflix Scale

**Why this example:** Netflix is the canonical monolith-to-microservices migration because the scale (200M+ subscribers, thousands of device types) makes monolithic coupling impossible to ignore. This scenario uniquely illustrates the Strangler Fig pattern—incrementally extracting services from a running system—and demonstrates how to sequence decomposition when modules have different risk profiles, change velocities, and compliance constraints.

```mermaid
graph LR
    subgraph Before["Legacy — Single DC"]
        Mono[Java Monolith · 10M LOC<br/>100 devs · 2-week deploys<br/>Tomcat 7 · JDK 8]
        Mono -->|JDBC · 500 conns| SingleDB[(Oracle 12c RAC<br/>64 vCPU · 512GB<br/>Single Point of Failure)]
    end

    subgraph After["AWS — 3 Regions · EKS"]
        Zuul[Zuul 2 Gateway<br/>Netty · 24 replicas<br/>Canary routing]
        US[User Svc · Java 17 · 12 replicas]
        USSidecar{{Envoy · mTLS · Retry 2x}}
        RS[Reco Svc · Python · 20 replicas<br/>TensorFlow Serving]
        RSSidecar{{Envoy · Timeout 200ms · CB}}
        SS[Streaming Svc · Go · 50 replicas<br/>Adaptive bitrate]
        SSSidecar{{Envoy · Retry 3x}}
        BS[Billing Svc · Java 17 · 6 replicas<br/>PCI-scoped]
        BSSidecar{{Envoy · mTLS · Timeout 3s}}
        Cassandra[(Cassandra 4.1 · RF=3 · 18 nodes)]
        Redis[(Redis Cluster · 12 shards)]
        S3[(S3 + CloudFront CDN)]
        MySQL[(Aurora MySQL · Multi-AZ · Encrypted)]
        Kafka[Kafka · 5 brokers · 200 partitions]

        Zuul -->|gRPC 2ms| US --- USSidecar
        Zuul -->|REST 10ms| RS --- RSSidecar
        Zuul -->|gRPC 3ms| SS --- SSSidecar
        Zuul -->|gRPC 4ms| BS --- BSSidecar
        US --> Cassandra
        RS --> Redis
        SS --> S3
        BS --> MySQL
        US -->|Kafka async · ProfileUpdated| Kafka
        SS -->|Kafka async · ViewingStarted 1M/min| Kafka
        Kafka --> RS
        Kafka --> BS
    end

    Before -->|Strangler Fig · 18 months| After

    style Zuul fill:#f9a825,color:#000
    style Kafka fill:#42a5f5,color:#000
    style USSidecar fill:#ce93d8,color:#000
    style RSSidecar fill:#ce93d8,color:#000
    style SSSidecar fill:#ce93d8,color:#000
    style BSSidecar fill:#ce93d8,color:#000
```

**How this solves the problem:** The Strangler Fig approach migrates one bounded context at a time while the monolith continues serving production traffic—no big-bang cutover. Zuul gradually shifts traffic based on canary metrics. Each service selects a purpose-fit database (Cassandra for high write-throughput profiles, Redis for sub-millisecond recommendation lookups, Aurora MySQL for ACID billing), eliminating the single Oracle bottleneck. Envoy sidecars enforce circuit breakers so a failing recommendation service cannot cascade into billing outages. Kafka decouples high-volume streaming events (1M+/min) from downstream consumers, allowing retraining and reconciliation at their own pace.

**Problem**: Netflix's monolithic Java application served 200M+ subscribers. A single deployment took 2 weeks of integration testing. A bug in the recommendation engine brought down billing. The Oracle database hit 80% CPU during peak, throttling all features equally.

**Solution**: Decompose along domain boundaries using the Strangler Fig pattern. Extract high-value, high-change services first (streaming, recommendations). Each service gets polyglot persistence—Cassandra for user profiles (high write throughput), Redis for recommendations (low-latency reads), S3+CDN for content delivery. Deploy services independently via Spinnaker with canary releases (5% → 25% → 100%).

**Key decisions**:

- Started with the **highest-churn** module (recommendations—50 deploys/month vs 2 for billing)
- Used **client libraries** (Hystrix, Ribbon) instead of a service mesh initially—later migrated
- Accepted **eventual consistency** between user profile and recommendation updates (2-5s lag acceptable)
- Kept billing as the **last service extracted** due to compliance requirements

---

## Industry Problem 2: E-Commerce Independent Scaling

**Why this example:** E-commerce exhibits extreme traffic asymmetry—catalog browsing outnumbers checkout by 25:1, and Black Friday creates sudden spikes that differ per service. This makes it the ideal scenario to illustrate per-service auto-scaling with different HPA metrics, the cost savings of decoupling read-heavy from write-heavy paths, and async propagation between search indexes and source-of-truth databases.

```mermaid
graph TB
    subgraph Edge["CDN + LB"]
        CDN[CloudFront · 95% cache hit]
        LB[AWS ALB · Health checks 10s]
    end

    subgraph K8s["Kubernetes — us-west-2"]
        subgraph CatNS["ns: catalog"]
            CatalogSvc[Catalog Svc · Java 21 · 20 replicas<br/>HPA: CPU > 60%]
            CatEP{{Envoy · CB · Max 1000 conc}}
        end
        subgraph ChkNS["ns: checkout"]
            CheckoutSvc[Checkout Svc · Go · 5 replicas<br/>HPA: queue depth > 50]
            ChkEP{{Envoy · Retry 2x · Timeout 3s · mTLS}}
        end
        subgraph SrcNS["ns: search"]
            SearchSvc[Search Svc · Python · 12 replicas<br/>HPA: p99 latency > 200ms]
            SrcEP{{Envoy · Timeout 500ms · CB}}
        end
        PriceSvc[Price Svc · Rust · 4 replicas<br/>In-memory cache · Refresh 30s]
        Kafka[Kafka · 3 brokers · 24 partitions<br/>product.updated · price.changed]
    end

    subgraph Data["Database-per-Service"]
        CatalogDB[(PostgreSQL 15<br/>1 Primary + 2 Replicas · 200ms lag)]
        CheckoutDB[(MySQL 8 · 2PC<br/>Encrypted at rest)]
        ES[(Elasticsearch 8 · 6 data + 3 master)]
        PriceDB[(Redis Cluster · 3 shards · < 1ms)]
    end

    CDN -->|Cache MISS ~5%| LB
    LB -->|REST 8ms · 50K RPM| CatalogSvc --- CatEP
    LB -->|REST 15ms · 2K RPM| CheckoutSvc --- ChkEP
    LB -->|REST 12ms · 30K RPM| SearchSvc --- SrcEP
    CatalogSvc --> CatalogDB
    CheckoutSvc --> CheckoutDB
    SearchSvc --> ES
    PriceSvc --> PriceDB
    CatalogSvc -->|Kafka async · ProductUpdated| Kafka
    Kafka -->|~5-10s lag| SearchSvc
    Kafka -->|~2s lag| PriceSvc

    style CatalogSvc fill:#66bb6a,color:#000
    style CheckoutSvc fill:#ef5350,color:#fff
    style Kafka fill:#42a5f5,color:#000
    style CDN fill:#f9a825,color:#000
    style CatEP fill:#ce93d8,color:#000
    style ChkEP fill:#ce93d8,color:#000
    style SrcEP fill:#ce93d8,color:#000
```

**How this solves the problem:** Each service scales on the metric that reflects its actual load—CPU for stateless catalog reads, queue depth for bursty checkout writes, p99 latency for search quality. The CDN absorbs 95% of catalog traffic so only cache misses hit pods. Kafka decouples catalog writes from the search index; a 5-10s lag is invisible to users but eliminates synchronous coupling. Checkout uses 2PC with MySQL for atomic payment + inventory deduction, while catalog uses eventually-consistent read replicas—each service picks the right consistency trade-off.

**Problem**: An e-commerce platform handles 50K RPM to catalog (browsing) but only 2K RPM to checkout (purchasing). During Black Friday, catalog traffic spikes 10x while checkout spikes 3x. Running everything in a monolith means provisioning for the sum of all peaks—wasting 60% of infrastructure budget during normal hours.

**Solution**: Split catalog (read-heavy, cacheable) from checkout (write-heavy, transactional). Catalog runs 20 stateless replicas behind a CDN with 95% cache hit rate. Checkout runs 5 replicas with sticky sessions and strong consistency. Search is powered by Elasticsearch, fed asynchronously from catalog changes via Kafka. Each service auto-scales on different metrics: catalog on CPU, checkout on request queue depth, search on query latency p99.

**Key decisions**:

- **Catalog** uses PostgreSQL read replicas with a 200ms replication lag—acceptable for product browsing
- **Checkout** uses synchronous writes with 2PC for payment + inventory deduction
- Kafka decouples catalog writes from search index updates—search can lag 5-10s without user impact
- Infrastructure cost dropped **45%** by right-sizing each service independently

---

## Industry Problem 3: Fintech Regulatory Isolation

**Why this example:** Financial services face a unique microservices challenge: regulatory blast radius. In a monolith, if any component touches card data, the entire codebase falls under PCI-DSS audit scope. This demonstrates how service boundaries drawn to minimize compliance surface area—a non-functional decomposition driver most tutorials ignore—can cut audit costs by 70% while enabling independent regulatory update cycles.

```mermaid
graph TB
    subgraph PCIDMZ["PCI DMZ — Isolated VPC"]
        GW[Kong Gateway · mTLS · WAF<br/>3 replicas · PCI Zone]
    end

    subgraph ZoneA["PCI Zone A — KYC"]
        KYC[KYC Svc · Java 17 · 4 replicas<br/>PII processing · ID verification]
        KYCEP{{Envoy · mTLS · Audit log · Max 100 conc}}
        KYCDB[(PostgreSQL 15 · AES-256 · TDE<br/>PII: name, SSN · Row-level security)]
    end

    subgraph ZoneB["PCI Zone B — Payment"]
        Pay[Payment Svc · Go · 6 replicas<br/>PCI-DSS L1 · Tokenization]
        PayEP{{Envoy · mTLS · Timeout 2s · CB}}
        PayDB[(Aurora MySQL · Multi-AZ<br/>Tokenized refs · 30-day purge)]
        HSM[CloudHSM · FIPS 140-2 L3]
    end

    subgraph StdZone["Standard Zone"]
        Acct[Account Svc · Node.js · 8 replicas]
        AcctEP{{Envoy · Retry 2x}}
        Rpt[Reporting Svc · Python · 3 replicas]
        RptEP{{Envoy · Timeout 10s}}
        AccDB[(PostgreSQL 15 · Balances + summaries)]
    end

    subgraph Events["Kafka — Encrypted Topics"]
        Kafka[Kafka · 3 brokers · TLS in-transit<br/>kyc.verified · payment.processed]
    end

    subgraph Audit["Audit Zone — Immutable"]
        AuditSvc[Audit Svc · Go · 2 replicas<br/>Append-only · WORM · 7yr retention]
        AuditStore[(S3 + Glacier · Write-once)]
    end

    Client[Client Apps] -->|HTTPS TLS 1.3| GW
    GW -->|gRPC 3ms · mTLS| KYC --- KYCEP
    GW -->|gRPC 4ms · mTLS| Pay --- PayEP
    GW -->|REST 6ms| Acct --- AcctEP
    GW -->|REST 15ms| Rpt --- RptEP
    KYC --> KYCDB
    Pay --> PayDB
    Pay --> HSM
    Acct --> AccDB
    KYC -->|Kafka async · KYCVerified<br/>Tokenized ref only| Kafka
    Pay -->|Kafka async · PaymentProcessed<br/>No raw card data| Kafka
    Kafka --> AuditSvc --> AuditStore
    Kafka --> Rpt
    Kafka --> Acct

    style GW fill:#f9a825,color:#000
    style KYC fill:#ff8a65,color:#000
    style Pay fill:#ff8a65,color:#000
    style AuditSvc fill:#a5d6a7,color:#000
    style Kafka fill:#42a5f5,color:#000
    style HSM fill:#ffcc80,color:#000
    style KYCEP fill:#ce93d8,color:#000
    style PayEP fill:#ce93d8,color:#000
    style AcctEP fill:#ce93d8,color:#000
    style RptEP fill:#ce93d8,color:#000
```

**How this solves the problem:** Network segmentation via isolated VPCs and Kubernetes namespaces creates hard boundaries between PCI-scoped and standard services, reducing audit surface to just KYC and Payment. The Payment service tokenizes via CloudHSM and stores only opaque references with 30-day auto-purge, satisfying PCI-DSS retention rules. Kafka topics carry only tokenized references—messages reaching the Standard Zone never contain PII or card data, keeping downstream services out of scope. The immutable Audit Service writes to WORM storage with 7-year retention, satisfying regulatory trail requirements without coupling audit concerns into business services.

**Problem**: A fintech startup processes 500K daily transactions and must comply with PCI-DSS, GDPR, and local banking regulations. Mixing payment card data with general user data in a monolith means the **entire system** falls under PCI audit scope (typical audit: $200K+ annually). KYC regulations change quarterly per jurisdiction, requiring frequent updates that risk destabilizing payment flows.

**Solution**: Isolate payment and KYC into dedicated services running in hardened PCI-compliant zones with encrypted-at-rest databases, network segmentation, and separate CI/CD pipelines with additional security scanning. General services (accounts, reporting) run in standard zones with relaxed controls. Communication between zones is async via Kafka with encrypted topics—payment events carry tokenized references, never raw card data.

**Key decisions**:

- PCI audit scope reduced from **entire platform** to 2 services—cutting compliance cost by 70%
- KYC service deploys independently—quarterly regulatory updates ship in 2 days, not 2 weeks
- Payment service uses **synchronous gRPC** to the payment gateway (latency-critical) but **async events** for downstream consumers
- All inter-service calls carry correlation IDs for end-to-end audit trails (regulatory requirement)

---

## Anti-Patterns

| Anti-Pattern               | Description                                               | Consequence                                                    |
| -------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| **Distributed Monolith**   | Services share a database or require lockstep deployments | All the complexity of microservices with none of the benefits  |
| **Nano-services**          | Decomposing too finely (1 service per CRUD entity)        | Network overhead dominates; 100+ services for a 10-person team |
| **Shared Libraries Creep** | Common libraries grow to contain business logic           | Coupling returns through the back door; version hell           |
| **Sync Chain**             | Service A → B → C → D synchronously                       | Latency compounds; availability = 0.99^4 = 0.96                |
| **No API Versioning**      | Breaking changes without versioning                       | Cascading failures across consumers                            |

---

> **Key Takeaway**: Microservices are an organizational scaling strategy, not a technical one. If you don't have independent teams that need to ship independently, you're buying distributed systems complexity for no payoff. Start with a well-structured monolith, extract services at the seams where **deployment independence** or **scaling isolation** delivers measurable value—not because the architecture diagram looks impressive.
