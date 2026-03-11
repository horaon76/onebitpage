---
title: "Design a Video Streaming Platform"
category: "Case Studies"
---

# Design a Video Streaming Platform

Building a video streaming platform like YouTube or Netflix means processing 500 hours of new video every minute, delivering 1 billion hours of playback daily to a global audience, adapting quality in real time to each viewer's network conditions, detecting copyrighted content within seconds of upload, and recommending the right video to the right user at the right time. Video is the hardest media type to serve at scale — it's bandwidth-intensive, latency-sensitive, and storage-hungry.

---

## Requirements

### Functional Requirements

- Video upload (up to 10GB per video)
- Video playback with adaptive bitrate streaming (multiple resolutions)
- Search by title, tags, and description
- Video recommendations (personalized home feed)
- Live streaming support
- Comments, likes, subscriptions
- Creator analytics (views, watch time, demographics)
- Content moderation and copyright detection

### Non-Functional Requirements

| Metric                                        | Target                              |
| --------------------------------------------- | ----------------------------------- |
| Monthly Active Users                          | 2B                                  |
| Video uploads                                 | 500 hours/minute (~720K videos/day) |
| Hours watched/day                             | 1B                                  |
| Average video size (raw)                      | 2GB                                 |
| Storage per minute of video (all resolutions) | ~300MB transcoded                   |
| Total storage growth                          | ~500PB/year                         |
| Playback start latency                        | < 2 seconds                         |
| CDN bandwidth                                 | ~100 Tbps peak                      |
| Availability                                  | 99.99%                              |

---

## High-Level Architecture

```mermaid
graph TB
    subgraph "Clients"
        Web[Web Player] & Mobile[Mobile App] & TV[Smart TV / OTT]
    end

    Web & Mobile & TV --> CDN[CDN<br/>Edge Servers Worldwide<br/>~100 Tbps capacity]
    Web & Mobile & TV --> API[API Gateway]

    subgraph "Upload Pipeline"
        API -->|Upload| UploadSvc[Upload Service<br/>Chunked Upload]
        UploadSvc --> ObjStore[(Object Storage<br/>Raw Videos)]
        UploadSvc --> MQ[Message Queue<br/>Transcode Jobs]
        MQ --> Transcode[Transcoding Service<br/>DAG Pipeline]
        Transcode --> TranscodedStore[(Object Storage<br/>Transcoded Videos)]
        TranscodedStore --> CDN
    end

    subgraph "Video Metadata"
        API --> MetaSvc[Metadata Service]
        MetaSvc --> MetaDB[(Vitess / MySQL<br/>Video Metadata)]
        MetaSvc --> SearchIdx[(Elasticsearch<br/>Search Index)]
    end

    subgraph "Playback"
        API -->|Manifest request| PlaySvc[Playback Service]
        PlaySvc --> ManifestGen[Manifest Generator<br/>HLS / DASH]
        PlaySvc --> CDN
    end

    subgraph "Recommendations"
        API --> RecSvc[Recommendation Service]
        RecSvc --> RecModel[ML Models<br/>Collaborative + Content Filtering]
        RecSvc --> UserHistory[(User Watch History<br/>Cassandra)]
    end

    subgraph "Content Safety"
        Transcode --> Copyright[Copyright Detection<br/>Content ID]
        Transcode --> Moderation[Content Moderation<br/>ML Classifiers]
    end
```

---

## Video Upload & Transcoding Pipeline

The upload pipeline is the most complex subsystem. Raw video must be split, transcoded into multiple resolutions and codecs, packaged for streaming, and then distributed to CDN — all within minutes.

```mermaid
graph TB
    subgraph "Upload Phase"
        Client[Creator's Device] -->|Chunked Upload<br/>Resumable| UploadSvc[Upload Service]
        UploadSvc -->|Store raw| S3Raw[(S3: Raw Videos)]
        UploadSvc -->|Enqueue job| SQS[Job Queue]
    end

    subgraph "Transcoding DAG"
        SQS --> Orchestrator[DAG Orchestrator<br/>Temporal / Airflow]
        Orchestrator --> Split[Split into Segments<br/>~10s chunks]
        Split --> T1[Transcode: 1080p H.264]
        Split --> T2[Transcode: 720p H.264]
        Split --> T3[Transcode: 480p H.264]
        Split --> T4[Transcode: 360p H.264]
        Split --> T5[Transcode: 1080p VP9]
        Split --> T6[Transcode: 4K H.265 / AV1]
        T1 & T2 & T3 & T4 & T5 & T6 --> Package[Package: HLS + DASH<br/>Generate manifests]
        Package --> Thumbnail[Generate Thumbnails<br/>Multiple timestamps]
        Thumbnail --> QA[Quality Assurance<br/>Automated checks]
    end

    subgraph "Post-Processing"
        QA --> S3Trans[(S3: Transcoded Segments)]
        QA --> Copyright[Content ID Scan]
        QA --> Moderate[ML Moderation]
        S3Trans --> CDNPush[CDN Pre-warm<br/>Popular regions]
    end
```

**DAG Pipeline:** Transcoding is modeled as a directed acyclic graph. Splitting into segments enables parallel transcoding — a 10-minute video split into 60 segments (10s each) can be transcoded across 60 workers simultaneously. Each resolution/codec is an independent branch. This reduces total transcode time from hours to minutes.

**Resumable Uploads:** Large files (up to 10GB) use chunked, resumable uploads (tus protocol). If the upload fails at 80%, the client resumes from chunk 81 instead of restarting.

---

## Adaptive Bitrate Streaming

```mermaid
sequenceDiagram
    participant P as Player
    participant CDN as CDN Edge
    participant Origin as Origin Server

    P->>CDN: Request manifest.m3u8
    CDN-->>P: HLS Manifest (lists all quality levels)

    loop Every Segment (~6 seconds)
        P->>P: Measure bandwidth + buffer level
        alt Bandwidth > 5Mbps, buffer healthy
            P->>CDN: GET segment_042_1080p.ts
        else Bandwidth 2-5Mbps
            P->>CDN: GET segment_042_720p.ts
        else Bandwidth < 2Mbps
            P->>CDN: GET segment_042_480p.ts
        end
        CDN-->>P: Video segment
        P->>P: Decode + Render
    end
```

**HLS (HTTP Live Streaming):** Video is split into 6-second segments. A master manifest (`.m3u8`) lists all available quality levels. The player's adaptive algorithm selects the quality for each segment based on measured throughput and buffer occupancy. This means quality adapts every 6 seconds without rebuffering.

**DASH (Dynamic Adaptive Streaming over HTTP)** provides the same functionality with an `.mpd` manifest and is codec-agnostic. Most platforms support both HLS (Apple ecosystem) and DASH (everything else).

---

## Data Model

| Table            | Column               | Type               | Notes                                   |
| ---------------- | -------------------- | ------------------ | --------------------------------------- |
| `videos`         | `video_id`           | BIGINT (Snowflake) | Globally unique                         |
|                  | `creator_id`         | BIGINT             | FK to users                             |
|                  | `title`              | VARCHAR(500)       | Searchable                              |
|                  | `description`        | TEXT               |                                         |
|                  | `duration_sec`       | INT                |                                         |
|                  | `status`             | ENUM               | uploading / processing / live / removed |
|                  | `upload_url`         | TEXT               | S3 path to raw video                    |
|                  | `created_at`         | TIMESTAMP          |                                         |
| `video_segments` | `video_id`           | BIGINT             |                                         |
|                  | `resolution`         | ENUM               | 360p / 480p / 720p / 1080p / 4K         |
|                  | `codec`              | ENUM               | h264 / vp9 / av1                        |
|                  | `segment_num`        | INT                | Ordered segment index                   |
|                  | `s3_path`            | TEXT               | Path to segment file                    |
|                  | `size_bytes`         | BIGINT             |                                         |
| `watch_history`  | `user_id`            | BIGINT             | Partition key (Cassandra)               |
|                  | `video_id`           | BIGINT             |                                         |
|                  | `watched_at`         | TIMESTAMP          |                                         |
|                  | `watch_duration_sec` | INT                | For recommendations                     |
|                  | `completed`          | BOOLEAN            | Watched > 90%                           |
| `video_stats`    | `video_id`           | BIGINT             | Counter table (Cassandra)               |
|                  | `view_count`         | COUNTER            | Approximate count                       |
|                  | `like_count`         | COUNTER            |                                         |
|                  | `comment_count`      | COUNTER            |                                         |

**Storage Strategy:** Video metadata in Vitess (sharded MySQL). Segments stored in S3-compatible object storage with lifecycle policies (cold storage after 1 year for unpopular videos). Watch history in Cassandra for fast writes and time-range queries. View counts use Cassandra counters (eventually consistent, acceptable for display).

---

## CDN Distribution

```mermaid
graph TB
    subgraph "CDN Architecture"
        Origin[Origin Servers<br/>S3 + Origin Shield] --> PoP1[PoP: US-East<br/>Cache Tier 1]
        Origin --> PoP2[PoP: EU-West<br/>Cache Tier 1]
        Origin --> PoP3[PoP: AP-South<br/>Cache Tier 1]

        PoP1 --> Edge1[Edge: NYC]
        PoP1 --> Edge2[Edge: DC]
        PoP2 --> Edge3[Edge: London]
        PoP2 --> Edge4[Edge: Frankfurt]
        PoP3 --> Edge5[Edge: Mumbai]
        PoP3 --> Edge6[Edge: Singapore]
    end

    subgraph "Cache Strategy"
        Hot[Hot Videos<br/>Top 10% = 90% traffic<br/>Cached at Edge]
        Warm[Warm Videos<br/>Next 20%<br/>Cached at PoP]
        Cold[Cold Videos<br/>Bottom 70%<br/>Origin only]
    end
```

**Cache Economics:** The top 10% of videos generate ~90% of traffic (Zipf distribution). These are cached at all edge locations. The next 20% are cached at regional PoPs. The long tail (70%) is served directly from origin. This keeps CDN costs manageable — caching everything would require exabytes of edge storage.

---

## Scaling & Bottlenecks

| Bottleneck                                        | Mitigation                                                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Transcoding compute (500 hrs/min × 6 resolutions) | Auto-scaling GPU/CPU fleet; segment-level parallelism; prioritize popular creators                            |
| Storage growth (~500 PB/year)                     | Tiered storage: hot (SSD), warm (HDD), cold (S3 Glacier); delete unpopular duplicate resolutions after 1 year |
| CDN bandwidth (100 Tbps peak)                     | Multi-CDN strategy (Akamai + Cloudflare + own CDN); smart routing based on cost and latency                   |
| Origin overload for viral videos                  | Origin shield (cache tier between CDN and origin); pre-warm CDN for trending videos                           |
| View count accuracy                               | Approximate counters for display; exact counts via Kafka + Flink pipeline for revenue                         |
| Recommendation freshness                          | Pre-compute candidates offline (hourly); re-rank in real-time at serving                                      |

---

## Industry Problems

### Problem 1: Processing 500 Hours of Video Per Minute Through the Transcoding Pipeline

500 hours/minute × 6 quality levels = 3,000 hours of transcoded video per minute. Each minute of 1080p transcoding takes ~3 minutes of CPU time. This means ~9,000 CPU-minutes of transcoding work per minute of wall-clock time — requiring a sustained fleet of 9,000+ transcoding workers.

```mermaid
graph TB
    subgraph "Transcoding Scaling Strategy"
        Queue[Job Queue<br/>SQS / RabbitMQ] --> Priority[Priority Router]
        Priority -->|High: Verified creators| Fast[Fast Lane<br/>GPU Workers<br/>NVENC hardware encoding]
        Priority -->|Normal| Standard[Standard Lane<br/>CPU Workers<br/>x264/libvpx]
        Priority -->|Low: Re-encodes| Batch[Batch Lane<br/>Spot Instances<br/>Off-peak processing]

        subgraph "Autoscaling"
            Standard --> ASG[Auto Scaling Group<br/>Min: 2000, Max: 15000<br/>Scale on queue depth]
        end
    end
```

**Solution:** Three-tier prioritization. Verified creators and live-to-VOD conversions get GPU-accelerated encoding (NVENC is 10× faster than CPU). Standard uploads use CPU workers on auto-scaling groups that scale based on queue depth. Re-encodes and format upgrades (e.g., AV1 migration) run on spot/preemptible instances during off-peak. Segment-level parallelism means a single video's transcode can span hundreds of workers.

### Problem 2: Adaptive Bitrate Streaming for Varying Network Conditions

Users switch between WiFi and cellular mid-stream, enter tunnels, or share bandwidth with other devices. The player must adapt without rebuffering.

```mermaid
graph LR
    subgraph "ABR Algorithm - Buffer-Based"
        Buffer[Buffer Level] --> Decision{Buffer State}
        Decision -->|Buffer > 30s| Up[Increase Quality<br/>Try next resolution up]
        Decision -->|Buffer 10-30s| Hold[Hold Current Quality<br/>Stable playback]
        Decision -->|Buffer < 10s| Down[Decrease Quality<br/>Drop resolution immediately]
        Decision -->|Buffer < 3s| Emergency[Emergency: Lowest Quality<br/>Prevent rebuffer]
    end
```

**Solution:** Modern ABR algorithms (like BBA — Buffer-Based Approach) use buffer occupancy as the primary signal, with throughput estimation as secondary. The player maintains a 30-second buffer target. Quality increases are conservative (only after sustained high buffer), while quality decreases are aggressive (immediate on buffer drop). Players also use segment-level bitrate hints from manifests to make pre-fetch decisions.

### Problem 3: Cold Start Problem for New Video Recommendations

When a new video is uploaded, the recommendation system has no engagement data (views, likes, watch time). How do you decide who should see it?

```mermaid
graph TB
    subgraph "Cold Start Resolution"
        NewVideo[New Video Uploaded] --> Content[Content Features<br/>- Title/description NLP embeddings<br/>- Visual features from thumbnails<br/>- Audio transcription topics<br/>- Creator's historical performance]

        Content --> Similar[Find Similar Videos<br/>Nearest neighbor in embedding space]
        Similar --> Borrow[Borrow engagement profile<br/>from similar videos]
        Borrow --> Initial[Initial Audience<br/>- Creator's subscribers<br/>- Users who liked similar content]
        Initial --> Explore[Exploration Budget<br/>Show to random sample of<br/>diverse users beyond initial match]
        Explore --> Observe[Measure Early Signals<br/>- Click-through rate<br/>- Watch time %<br/>- Like/dislike ratio]
        Observe --> Update[Update Recommendations<br/>Within 1 hour of upload]
    end
```

**Solution:** Content-based features (NLP embeddings of title/description, visual features from thumbnail, creator history) bootstrap the recommendation. The video is initially shown to the creator's subscribers and users with affinity for similar content. An exploration budget (typically 5% of recommendation slots) ensures new videos get some exposure to diverse audiences. Early engagement signals (especially watch-time percentage, not just clicks) feed back into the model within 1 hour.

### Problem 4: Copyright Detection (Content ID System)

Creators upload copyrighted music, movie clips, and sports highlights. The platform must detect these within minutes to avoid legal liability.

```mermaid
graph TB
    subgraph "Content ID Pipeline"
        Upload[Uploaded Video] --> Extract[Feature Extraction]

        subgraph "Audio Fingerprinting"
            Extract --> Audio[Audio Track Extraction]
            Audio --> Spectro[Spectrogram Analysis]
            Spectro --> AudioFP[Audio Fingerprint<br/>Chromaprint / Dejavu]
        end

        subgraph "Video Fingerprinting"
            Extract --> Frames[Key Frame Extraction<br/>Every 2 seconds]
            Frames --> VisualFP[Visual Fingerprint<br/>Perceptual Hash]
        end

        AudioFP & VisualFP --> Match[Matching Service<br/>Compare against reference DB<br/>~80M reference files]

        Match -->|Match found > 90%| Policy{Rights Holder Policy}
        Policy -->|Monetize| Ads[Show ads, share revenue]
        Policy -->|Block| Remove[Remove video]
        Policy -->|Track| Track[Track views, report to owner]
        Match -->|No match| Pass[Allow video]
    end
```

**Solution:** Dual fingerprinting — audio (chromaprint-style spectral analysis) and video (perceptual hashing of key frames). Fingerprints are compared against a reference database of ~80M copyrighted works using locality-sensitive hashing for sub-second lookup. Rights holders define policies per work: monetize (run ads and share revenue), block (remove the video), or track (allow but report analytics). The system runs during transcoding so results are available before the video goes live.

### Problem 5: Live Streaming at Scale With Sub-Second Latency

Traditional HLS/DASH have 6-30 second latency (segment duration + encoding delay + CDN propagation). Live streaming for sports, gaming, and auctions needs sub-second latency.

**Solution:** Low-latency HLS (LL-HLS) and CMAF with chunked transfer encoding. Instead of waiting for a full 6-second segment, the encoder emits partial segments (200ms chunks) via chunked HTTP transfer. The CDN forwards chunks as they arrive rather than waiting for the complete segment. Combined with server push (HTTP/2) and preload hints, this achieves 1-3 second glass-to-glass latency. For sub-second requirements (e.g., live auctions), WebRTC-based delivery bypasses the segment model entirely but doesn't scale beyond ~10K concurrent viewers without a selective forwarding unit (SFU) mesh.

---

## Anti-Patterns & Common Mistakes

- **Transcoding all resolutions eagerly** — A video with 10 views doesn't need 4K AV1. Transcode 720p and 1080p immediately; add higher resolutions only if the video gains traction
- **Single CDN provider** — CDN outages happen. Multi-CDN with real-time quality-of-experience monitoring and automatic failover is essential
- **Using view count as the primary recommendation signal** — Optimizing for clicks leads to clickbait. Watch-time percentage is a much better signal for content quality
- **Synchronous copyright check before publishing** — Content ID scanning can take minutes. Allow the video to start processing while scanning runs in parallel; block publication only on match
- **Ignoring the long tail** — 70% of videos get minimal views but represent significant storage cost. Apply tiered storage and consider dropping redundant resolutions for cold content
- **Fixed bitrate segments** — Variable bitrate (VBR) encoding produces better quality per bit but makes ABR harder; use constrained VBR with bitrate caps

---

> **Key Takeaway:** Video streaming is fundamentally a storage and bandwidth problem. The transcoding pipeline is the most compute-intensive subsystem — segment-level parallelism and priority queues are essential. CDN architecture must exploit the Zipf distribution (cache the head, serve the tail from origin). Adaptive bitrate streaming and Content ID are the differentiating technical features. Every design decision trades off between cost (storage, compute, bandwidth), quality (resolution, latency), and scale (number of concurrent viewers).
