---
title: "CDN"
category: "Fundamentals"
---

# Content Delivery Network (CDN)

A CDN is a globally distributed network of proxy servers that caches and serves content from edge locations closest to end users, reducing latency from hundreds of milliseconds to single-digit milliseconds. Modern CDNs operate a multi-tier architecture — edge PoPs handle TLS termination and serve cached content, regional mid-tier shields aggregate cache misses to protect the origin, and origin servers act as the authoritative source. The key challenge isn't just distributing static files — it's **cache coherence at global scale**: ensuring 300+ edge locations serve consistent content while maintaining sub-10ms response times and handling cache invalidation across billions of objects.

## Intent

- Minimize latency by serving content from the nearest edge location, eliminating cross-continent round-trips.
- Absorb traffic spikes at the edge, shielding origin servers from flash crowds and DDoS attacks.
- Offload TLS termination and HTTP/2-3 negotiation to edge PoPs, freeing origin CPU for application logic.
- Enable instant global purge: invalidate stale content across all edge locations within seconds of an origin update.

## Architecture Overview

```mermaid
graph TB
    subgraph "Edge Tier — 400+ PoPs"
        User1[User — New York] -->|"TLS 1.3 terminate, ~2ms"| Edge_NA1[CloudFront PoP NYC<br/>Varnish Edge Cache<br/>50TB SSD, HTTP/3]
        User2[User — London] -->|"TLS terminate, ~3ms"| Edge_EU1[CloudFront PoP LHR<br/>Varnish Edge Cache<br/>50TB SSD, HTTP/3]
        User3[User — Tokyo] -->|"TLS terminate, ~2ms"| Edge_AP1[CloudFront PoP NRT<br/>Varnish Edge Cache<br/>50TB SSD, HTTP/3]
    end

    subgraph "Regional Shield Tier"
        Edge_NA1 -->|"MISS |~15% of requests, 8ms|"| Shield_NA[Origin Shield US-East<br/>Varnish Mid-Tier r6g.4xlarge × 6<br/>200TB SSD, ~92% hit]
        Edge_EU1 -->|"MISS |~15%, 12ms|"| Shield_EU[Origin Shield EU-West<br/>Varnish Mid-Tier r6g.4xlarge × 4<br/>150TB SSD, ~90% hit]
        Edge_AP1 -->|"MISS |~15%, 10ms|"| Shield_AP[Origin Shield AP-NE<br/>Varnish Mid-Tier r6g.4xlarge × 4<br/>150TB SSD, ~90% hit]
    end

    subgraph "Origin Tier — US-East-1"
        Shield_NA -->|"MISS |~8% of shield, 25ms|"| Origin_LB[ALB Origin |~12K req/s|]
        Shield_EU -->|"MISS |~10%, 150ms cross-region|"| Origin_LB
        Shield_AP -->|"MISS |~10%, 180ms cross-region|"| Origin_LB
        Origin_LB --> App1[App Server 1<br/>c5.2xlarge] & App2[App Server 2] & AppN[App Server N × 8-30]
        App1 & App2 & AppN --> DB[(Aurora PostgreSQL<br/>Primary r5.4xlarge)]
        App1 & App2 & AppN --> S3[S3 Origin Bucket<br/>Static Assets]
    end

    subgraph "Invalidation Bus"
        App1 -->|"purge event"| Kafka[Kafka Purge Topic<br/>32 partitions]
        Kafka -->|"batch purge API"| Edge_NA1 & Edge_EU1 & Edge_AP1
        Kafka -->|"shield purge"| Shield_NA & Shield_EU & Shield_AP
    end
```

## Key Concepts

### CDN Tiers

| Tier                | Role                                    | Latency to User | Hit Rate | Storage        |
| ------------------- | --------------------------------------- | --------------- | -------- | -------------- |
| **Edge PoP**        | TLS termination, HTTP/3, first cache    | 1-10ms          | 80-95%   | 50TB SSD/PoP   |
| **Regional Shield** | Aggregates edge misses, protects origin | 8-25ms          | 85-95%   | 150-200TB SSD  |
| **Origin Server**   | Authoritative source, dynamic content   | 25-200ms        | N/A      | Application DB |

### Cache-Control Strategies

| Directive                     | Behavior                                               | Use Case                        |
| ----------------------------- | ------------------------------------------------------ | ------------------------------- |
| **max-age=86400**             | Edge caches for 24 hours                               | Static assets (JS, CSS, images) |
| **s-maxage=30**               | CDN caches 30s; browser may cache differently          | Semi-dynamic API responses      |
| **stale-while-revalidate=60** | Serve stale for 60s while fetching fresh in background | Product pages, catalog data     |
| **stale-if-error=300**        | Serve stale for 5 min if origin returns 5xx            | Graceful degradation            |
| **no-store**                  | Never cache; always fetch from origin                  | User-specific data, checkout    |
| **private**                   | Only browser may cache; CDN must not                   | Authenticated pages, dashboards |

### CDN Invalidation Methods

| Method                   | Speed        | Granularity      | Complexity |
| ------------------------ | ------------ | ---------------- | ---------- |
| **TTL Expiration**       | Up to TTL    | Per-object       | Low        |
| **Purge by URL**         | 1-5 seconds  | Single object    | Low        |
| **Purge by path/prefix** | 2-10 seconds | Group of objects | Medium     |
| **Surrogate key / tag**  | 1-5 seconds  | Logical group    | Medium     |

| **Soft purge (stale)** | Instant | Per-object | Low |

---

## Industry Problem 1 — Global Video Streaming Platform (Netflix / YouTube Scale)

**Why this example:** Video streaming is the ultimate CDN bandwidth challenge — a single 4K stream consumes 25 Mbps sustained, and peak evening traffic can push total throughput to 200+ Tbps globally. Unlike static web assets, video segments must be served with zero buffer gaps, making cache miss latency catastrophic. This scenario uniquely tests multi-tier CDN fill strategies, regional storage pre-positioning, and the long-tail problem where millions of niche titles each get a handful of views yet must still stream seamlessly.

**Problem:** A streaming platform serves 250M subscribers across 190 countries. During peak (8-11 PM per timezone), 120M concurrent streams generate 180 Tbps of egress. The catalog holds 15K titles at 4K (avg 8GB/hour), totaling 500 PB of encoded content. Popular titles (top 500) account for 60% of traffic, but long-tail titles still generate 40%. Origin fetch for a cold segment takes 200-500ms — causing visible buffering. Cache storage at each PoP is limited to 50TB, so only ~6,000 hours of 4K content fits per edge.

**Solution:**

```mermaid
graph TB
    subgraph "Edge Tier — North America (120 PoPs)"
        Viewer1[Viewer — Chicago] -->|"HTTPS/2, ~2ms edge hit"| Edge_CHI[Akamai PoP ORD<br/>50TB NVMe, Nginx + Varnish<br/>|~88% hit rate|]
    end

    subgraph "Edge Tier — Europe (80 PoPs)"
        Viewer3[Viewer — Berlin] -->|"~3ms edge hit"| Edge_FRA[Akamai PoP FRA<br/>50TB NVMe<br/>|~85% hit|]
    end

    subgraph "Edge Tier — Asia-Pacific (60 PoPs)"
        Viewer4[Viewer — Mumbai] -->|"~4ms edge hit"| Edge_BOM[Akamai PoP BOM<br/>50TB NVMe<br/>|~82% hit|]
    end

    subgraph "Regional Shield — US-Central"
        Edge_CHI -->|"MISS |~12%, 8ms|"| Shield_US[Origin Shield US-Central<br/>Varnish r6g.8xlarge × 12<br/>500TB SSD, |~94% hit|]
    end

    subgraph "Regional Shield — EU-West"
        Edge_FRA -->|"MISS |~15%, 10ms|"| Shield_EU[Origin Shield EU-West<br/>Varnish r6g.8xlarge × 8<br/>400TB SSD, |~92% hit|]
    end

    subgraph "Regional Shield — AP-South"
        Edge_BOM -->|"MISS |~18%, 12ms|"| Shield_AP[Origin Shield AP-South<br/>Varnish r6g.4xlarge × 6<br/>300TB SSD, |~90% hit|]
    end

    subgraph "Origin Storage — US-East-1"
        Shield_US -->|"MISS |~6%, 25ms|"| OriginLB[ALB Origin<br/>|~80K segment req/s|]
        Shield_EU -->|"MISS |~8%, 150ms|"| OriginLB
        Shield_AP -->|"MISS |~10%, 200ms|"| OriginLB
        OriginLB --> Packager[Packaging Svc × 40<br/>Just-in-time ABR encoding]
        Packager --> S3[S3 — Master Store<br/>500 PB, 15K titles × 8 bitrates]
    end

    subgraph "Pre-Positioning Pipeline"
        Catalog[Catalog Metadata Svc] -->|"popularity predictions"| Prefetch[Prefetch Orchestrator<br/>ML-based regional demand]
        Prefetch -->|"pre-warm top 500 titles"| Shield_US & Shield_EU & Shield_AP
        Prefetch -->|"pre-warm top 200 per region"| Edge_CHI & Edge_FRA & Edge_BOM
    end

    subgraph "Purge / Manifest Update"
        Catalog -->|"new encoding available"| Kafka[Kafka Purge Topic]
        Kafka -->|"surrogate-key purge |<2s global|"| Edge_CHI & Edge_FRA & Edge_BOM
        Kafka -->|"shield purge"| Shield_US & Shield_EU & Shield_AP
    end
```

**How this solves the problem:** The three-tier architecture converts 180 Tbps of viewer demand into ~10 Tbps of origin egress — an 18× reduction. Edge PoPs serve 85-88% of segments at 2-4ms, eliminating buffering for popular content. Regional shields achieve 90-94% hit rates so origin sees only 6-10% of total demand. The ML pre-positioning pipeline predicts regional popularity 24 hours ahead and warms caches before peak, converting cold misses into warm hits. For the long-tail, shields act as aggregation points — 60 Asian edge PoPs share one shield, so a niche title fetched once from origin serves all 60.

**Key decisions:**

- **Predictive pre-warming over pure pull-through** — ML models trained on viewing patterns pre-position the top 500 titles at shields and top 200 at edges before peak, eliminating first-viewer cold misses during primetime.
- **Just-in-time packaging at origin** — rather than storing every bitrate/codec combination, the origin packages ABR segments on demand from mezzanine files, reducing storage from 500 PB to ~200 PB.
- **Regional shields as long-tail aggregators** — instead of filling 300 edge caches independently (thundering herd to origin), shields coalesce misses so each segment is fetched from origin exactly once per region.

---

## Industry Problem 2 — Global E-Commerce Flash Sale (Amazon Prime Day / Singles' Day Scale)

**Why this example:** Flash sales create the most extreme CDN cache invalidation challenge — prices, stock counts, and deal pages must update across all edges within seconds while traffic spikes 50-100× baseline in minutes. Unlike video streaming where content is immutable once encoded, e-commerce pages are semi-dynamic: the HTML shell is cacheable but price/stock widgets change every second. This uniquely tests edge-side includes (ESI), micro-TTL strategies, and the tension between freshness and origin protection during traffic bombs.

**Problem:** An e-commerce platform runs a 48-hour flash sale. Normal traffic is 200K req/s; the sale drives 12M req/s at peak (60× spike) within the first 5 minutes. 50K deal products have prices that change every 30 seconds based on demand. Stock levels decrement in real time — showing "in stock" for a sold-out item causes order failures. The product page must load in <200ms globally with P99 <500ms. Last year's sale overwhelmed the origin at 3M req/s, causing a 20-minute outage.

**Solution:**

```mermaid
graph TB
    subgraph "Edge Tier — North America (150 PoPs)"
        Shopper1[Shopper — NYC] -->|"TLS 1.3, ~2ms"| Edge_NYC[Fastly PoP NYC<br/>Varnish VCL + ESI<br/>|~94% hit rate|]
        Shopper2[Shopper — Dallas] -->|"~2ms"| Edge_DFW[Fastly PoP DFW<br/>Varnish VCL + ESI<br/>|~94% hit|]
    end

    subgraph "Edge Tier — Europe (100 PoPs)"
        Shopper3[Shopper — Paris] -->|"~3ms"| Edge_CDG[Fastly PoP CDG<br/>Varnish VCL + ESI<br/>|~92% hit|]
    end

    subgraph "Edge Tier — Asia-Pacific (80 PoPs)"
        Shopper4[Shopper — Singapore] -->|"~4ms"| Edge_SIN[Fastly PoP SIN<br/>Varnish VCL + ESI<br/>|~90% hit|]
    end

    subgraph "Regional Shield — US-East"
        Edge_NYC -->|"MISS |~6%, 5ms|"| Shield_US[Origin Shield US-East<br/>Fastly Shield r6g.4xlarge × 10<br/>|~96% hit, request coalescing|]
        Edge_DFW -->|"MISS |~6%, 12ms|"| Shield_US
    end

    subgraph "Regional Shield — EU-West"
        Edge_CDG -->|"MISS |~8%, 8ms|"| Shield_EU[Origin Shield EU-West<br/>Fastly Shield r6g.4xlarge × 6<br/>|~94% hit, coalescing|]
    end

    subgraph "Regional Shield — AP-SE"
        Edge_SIN -->|"MISS |~10%, 10ms|"| Shield_AP[Origin Shield AP-SE<br/>Fastly Shield r6g.4xlarge × 4<br/>|~92% hit, coalescing|]
    end

    subgraph "Origin — US-East-1"
        Shield_US -->|"MISS |~4%, 20ms|"| OriginLB[ALB Origin |~50K req/s max|]
        Shield_EU -->|"MISS |~6%, 140ms|"| OriginLB
        Shield_AP -->|"MISS |~8%, 180ms|"| OriginLB
        OriginLB --> Page1[Page Assembly Svc × 30<br/>ESI template + fragments] & Page2[Page Assembly Svc × 30]
        Page1 & Page2 -->|"product metadata"| ProductRedis[Redis Product Cache<br/>r6g.4xlarge × 12]
        Page1 & Page2 -->|"price/stock"| PriceAPI[Price/Stock API × 20<br/>|real-time, no-cache|]
        PriceAPI --> PriceRedis[Redis Write-Through<br/>r6g.2xlarge × 8]
        PriceRedis --> PriceDB[(DynamoDB Pricing)]
        PriceRedis --> InvDB[(Aurora Inventory)]
    end

    subgraph "Invalidation — Real-Time Purge"
        PriceAPI -->|"price change event"| Kafka[Kafka Purge Topic<br/>128 partitions]
        Kafka -->|"surrogate-key purge |<1.5s|"| Edge_NYC & Edge_DFW & Edge_CDG & Edge_SIN
        Kafka -->|"shield purge"| Shield_US & Shield_EU & Shield_AP
        Kafka -->|"stock=0 → force no-store"| Edge_NYC & Edge_DFW & Edge_CDG & Edge_SIN
    end

    subgraph "Pre-Sale Warm-Up"
        DealCatalog[Deal Catalog] -->|"T-30min: pre-warm all deal pages"| Shield_US & Shield_EU & Shield_AP
        DealCatalog -->|"T-15min: pre-warm top 1K deals"| Edge_NYC & Edge_DFW & Edge_CDG & Edge_SIN
    end
```

**How this solves the problem:** Edge-Side Includes (ESI) split each product page into a cacheable shell (layout, description, images — TTL 3600s) and dynamic fragments (price widget — TTL 5s, stock badge — TTL 3s). This means 94% of the page bytes are served from edge at 2ms, while only the tiny price/stock fragments trigger short-TTL revalidation. Request coalescing at the shield tier ensures that when a popular deal's 5-second TTL expires, only one request per shield reaches the origin — collapsing 100K concurrent misses into 3 origin requests (one per shield region). The pre-sale warm-up fills all shields 30 minutes before launch and edges 15 minutes before, so the initial traffic bomb hits warm caches. Kafka-driven surrogate-key purges propagate price changes to all 330 PoPs within 1.5 seconds, and when stock hits zero, the purge event switches the fragment to `no-store`, ensuring no edge serves a stale "in stock" badge.

**Key decisions:**

- **ESI fragment decomposition** — separating stable content (images, descriptions) from volatile content (prices, stock) at the edge means a price change invalidates only a 200-byte fragment, not the entire 500KB page. This reduces purge bandwidth by 2,500×.
- **Micro-TTL (3-5s) + surrogate-key purge** — the 5-second price TTL is a safety net; active purges via Kafka propagate faster. This dual approach guarantees worst-case 5-second staleness with typical <2-second freshness.
- **Shield-level request coalescing** — Fastly's `req.hash_always_miss` + coalescing collapses thundering herds. A deal page expiring simultaneously across 150 NA PoPs generates one origin request, not 150.
- **Stock-zero forced no-store** — once inventory depletes, the purge sets `no-store` on the stock fragment. This is more aggressive than TTL — no edge will serve "in stock" for even 1 second after depletion.

---

## Industry Problem 3 — Global News & Breaking Events (CNN / BBC Scale)

**Why this example:** Breaking news combines the worst CDN challenges simultaneously: unpredictable traffic spikes (10-100× in minutes when a major event breaks), rapid content updates (articles rewritten every 30 seconds during live events), and geographic hotspots where one region may spike while others remain normal. Unlike e-commerce where product IDs are known in advance, breaking news creates entirely new URLs that have zero cache history, testing the CDN's cold-start behavior under extreme load.

**Problem:** A global news platform normally serves 150K req/s. When a major event breaks, traffic surges to 8M req/s within 3 minutes — a 53× spike. Journalists update the lead article every 30-60 seconds with new paragraphs, photos, and embedded videos. There are 50M unique URLs across the site, but during breaking news, 80% of traffic concentrates on 5-10 URLs that didn't exist 5 minutes ago. The origin (40 app servers) can handle 300K req/s maximum. Last major event caused a 12-minute origin collapse when CDN cache was cold for the new URLs.

**Solution:**

```mermaid
graph TB
    subgraph "Edge Tier — North America"
        Reader1[Reader — Boston] -->|"TLS 1.3, ~2ms"| Edge_BOS[CloudFront PoP BOS<br/>HTTP/3, Brotli compression<br/>|~90% hit normal, ~96% breaking|]
        Reader2[Reader — SF] -->|"~2ms"| Edge_SFO[CloudFront PoP SFO<br/>|~90% hit normal|]
    end

    subgraph "Edge Tier — Europe"
        Reader3[Reader — London] -->|"~3ms"| Edge_LHR[CloudFront PoP LHR<br/>|~88% hit normal|]
    end

    subgraph "Edge Tier — Asia-Pacific"
        Reader4[Reader — Seoul] -->|"~4ms"| Edge_ICN[CloudFront PoP ICN<br/>|~85% hit normal|]
    end

    subgraph "Regional Shield — US-East"
        Edge_BOS -->|"MISS |~10%, 6ms|"| Shield_US[Origin Shield US-East<br/>Varnish + Request Coalescing<br/>r6g.4xlarge × 8<br/>stale-while-revalidate: 30s<br/>|~97% hit during breaking|]
        Edge_SFO -->|"MISS |~10%, 20ms|"| Shield_US
    end

    subgraph "Regional Shield — EU-West"
        Edge_LHR -->|"MISS |~12%, 10ms|"| Shield_EU[Origin Shield EU-West<br/>Varnish + Coalescing<br/>r6g.4xlarge × 6<br/>|~95% hit during breaking|]
    end

    subgraph "Regional Shield — AP-NE"
        Edge_ICN -->|"MISS |~15%, 12ms|"| Shield_AP[Origin Shield AP-NE<br/>Varnish + Coalescing<br/>r6g.4xlarge × 4<br/>|~93% hit during breaking|]
    end

    subgraph "Origin — US-East-1"
        Shield_US -->|"MISS |~3%, 20ms|"| OriginLB[ALB Origin<br/>|~120K req/s max headroom|]
        Shield_EU -->|"MISS |~5%, 140ms|"| OriginLB
        Shield_AP -->|"MISS |~7%, 190ms|"| OriginLB
        OriginLB --> CMS1[CMS Rendering × 20<br/>Server-side render] & CMS2[CMS Rendering × 20]
        CMS1 & CMS2 --> ArticleDB[(Aurora PostgreSQL<br/>r5.4xlarge Multi-AZ)]
        CMS1 & CMS2 --> MediaS3[S3 — Images/Video<br/>CloudFront direct origin]
    end

    subgraph "Publish Pipeline — Instant Purge"
        Editor[Editor publishes update] -->|"save article v42"| CMS1
        CMS1 -->|"purge event"| Kafka[Kafka Purge Topic<br/>64 partitions]
        Kafka -->|"surrogate-key purge |<1s|"| Edge_BOS & Edge_SFO & Edge_LHR & Edge_ICN
        Kafka -->|"shield purge + pre-warm"| Shield_US & Shield_EU & Shield_AP
        CMS1 -->|"push-to-shield pre-render"| Shield_US
    end

    subgraph "Breaking News Auto-Scale"
        TrafficMonitor[Traffic Spike Detector<br/>Flink — >5× baseline in 60s] -->|"trigger"| AutoScale[Auto-Scale Orchestrator]
        AutoScale -->|"scale origin 40→120 servers"| OriginLB
        AutoScale -->|"switch breaking articles to<br/>stale-while-revalidate: 60s"| Edge_BOS & Edge_SFO & Edge_LHR & Edge_ICN
        AutoScale -->|"enable request coalescing<br/>+ micro-TTL 10s"| Shield_US & Shield_EU & Shield_AP
    end
```

**How this solves the problem:** The architecture handles the 53× spike through three mechanisms. First, `stale-while-revalidate` at edge (30s normal, 60s breaking) and shield tiers means readers always get an instant response while a single background revalidation fetches the latest version — converting 8M req/s into one revalidation per edge per TTL window. Second, shield-level coalescing ensures 200 simultaneous edge revalidations produce one origin request. Third, the publish pipeline pre-warms shields on every article save — within 1 second the new version is pushed to all shields and purged from edges. The Flink spike detector triggers auto-scaling within 60 seconds, expanding origin from 40 to 120 servers while lengthening `stale-while-revalidate` windows.

**Key decisions:**

- **Stale-while-revalidate as primary defense** — readers tolerate 30-60 seconds of staleness for breaking news (they're refreshing anyway). This single header eliminates 99% of the thundering herd problem without any application logic.
- **Push-to-shield on publish** — rather than waiting for the first reader to trigger a cold miss, the CMS pushes rendered HTML to all shields on every save. This eliminates the cold-start problem for brand-new URLs.
- **Adaptive CDN behavior on spike detection** — Flink detects anomalous traffic within 60 seconds and dynamically adjusts edge TTLs and enables coalescing. Normal operation uses aggressive 10s TTLs for freshness; breaking-news mode prioritizes origin protection.
- **Surrogate-key grouping** — all fragments of a breaking story (article HTML, hero image, live blog widget) share a surrogate key. One purge call invalidates all related objects across all PoPs, ensuring readers never see a stale headline with an updated photo.

---

## CDN Architecture Patterns Summary

| Pattern                                 | Description                                                        | When to Use                                               |
| --------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| **Multi-Tier (Edge → Shield → Origin)** | Edge serves users; shield aggregates misses; origin is last resort | Any high-traffic system — reduces origin load 10-100×     |
| **Edge-Side Includes (ESI)**            | Assemble pages from independently cached fragments at the edge     | Pages with mixed TTLs (static shell + dynamic widgets)    |
| **Stale-While-Revalidate**              | Serve stale immediately, revalidate in background                  | Latency-sensitive content that tolerates brief staleness  |
| **Request Coalescing**                  | Collapse concurrent misses for the same key into one origin fetch  | Thundering herd protection during TTL expiry or purges    |
| **Surrogate-Key Purge**                 | Tag cached objects with logical keys; purge by tag                 | Complex invalidation (all assets for one article/product) |
| **Predictive Pre-Warming**              | Push content to edges/shields before demand arrives                | Scheduled events (launches, sales, primetime)             |

## Anti-Patterns

- **Single-tier CDN without origin shield:** Every edge miss goes directly to origin. With 300+ PoPs, a popular object expiring simultaneously generates 300 origin requests. Always use a shield tier.
- **Long TTLs without purge capability:** Setting `max-age=86400` without a purge API means price changes take 24 hours to propagate. Pair long TTLs with surrogate-key purges.
- **Caching authenticated responses at the edge:** Serving one user's dashboard to another is a privacy violation. Use `Cache-Control: private` or `no-store` for user-specific content.
- **Ignoring `Vary` header proliferation:** `Vary: Accept-Encoding, Accept-Language, User-Agent` creates thousands of variants per URL, destroying hit rates. Normalize headers at the edge.

## Key Takeaway

> A CDN is not a single cache layer — it's a **multi-tier content delivery architecture** where edge PoPs provide sub-5ms responses and TLS termination for end users, regional origin shields aggregate cache misses and protect the origin from thundering herds, and the origin serves as the authoritative source of truth. The hardest problem is balancing freshness against origin protection: use short TTLs with `stale-while-revalidate` for content that changes frequently, surrogate-key purges for instant invalidation across all PoPs, and request coalescing at shield tiers to collapse concurrent misses. Always decompose pages into independently cacheable fragments (ESI), pre-warm caches before predictable traffic spikes, and implement adaptive TTL strategies that automatically shift from freshness-optimized to protection-optimized when traffic anomalies are detected.
