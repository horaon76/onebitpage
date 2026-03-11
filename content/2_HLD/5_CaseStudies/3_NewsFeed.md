---
title: "Design a News Feed"
category: "Case Studies"
---

# Design a News Feed

The news feed — the central experience of Facebook, Twitter, and Instagram — is a personalized, ranked, real-time stream of content from people and pages a user follows. Designing it means solving fan-out at celebrity scale (100M followers), ranking billions of posts with ML models in real time, moderating content before it reaches users, and keeping the feed fresh without overwhelming the infrastructure. This is the quintessential system design problem because it touches every major distributed systems concept.

---

## Requirements

### Functional Requirements

- Users can publish posts (text, images, video, links)
- Users see a personalized, ranked feed of posts from their connections
- Feed updates in near-real-time (< 30s for new posts to appear)
- Support for likes, comments, shares with counts
- Cursor-based pagination for infinite scroll
- Content moderation (block harmful/spam content before it reaches feeds)

### Non-Functional Requirements

| Metric                          | Target                           |
| ------------------------------- | -------------------------------- |
| Daily Active Users (DAU)        | 500M                             |
| Posts created/day               | 2B                               |
| Feed reads/day                  | 10B (avg 20 feed loads per user) |
| Feed generation latency (p99)   | < 500ms                          |
| Post-to-feed propagation        | < 30s for 95th percentile        |
| Average followers per user      | 200                              |
| Celebrity users (>1M followers) | ~50K                             |
| Availability                    | 99.99%                           |

---

## High-Level Architecture

```mermaid
graph TB
    subgraph "Clients"
        Web[Web Client] & Mobile[Mobile App]
    end

    Web & Mobile --> API[API Gateway<br/>Auth + Rate Limiting]

    subgraph "Write Path"
        API -->|POST /posts| PostSvc[Post Service]
        PostSvc --> PostDB[(Post Store<br/>Vitess/MySQL)]
        PostSvc --> Moderate[Content Moderation<br/>Pipeline]
        PostSvc --> FanOut[Fan-Out Service]
        FanOut --> FeedCache[(Feed Cache<br/>Redis Sorted Sets)]
        FanOut --> Kafka[Kafka<br/>Fan-Out Events]
    end

    subgraph "Read Path"
        API -->|GET /feed| FeedSvc[Feed Service]
        FeedSvc --> FeedCache
        FeedSvc --> Ranker[Feed Ranker<br/>ML Model]
        FeedSvc --> Merge[Feed Merger<br/>Celebrity Pull + Cache]
        Merge --> PostDB
    end

    subgraph "Supporting Services"
        Social[(Social Graph<br/>TAO / Graph DB)]
        Media[Media Service<br/>Upload + CDN]
        Notify[Notification Service]
    end

    PostSvc --> Media
    FanOut --> Social
    PostSvc --> Notify
```

---

## Fan-Out Strategy: The Hybrid Approach

The fundamental design decision: when a user publishes a post, do we push it to all followers' feeds (fan-out on write) or compute the feed at read time (fan-out on read)?

```mermaid
graph TB
    subgraph "Fan-Out on Write (Push Model)"
        Post1[New Post by User A] --> FOW[Fan-Out Workers]
        FOW -->|Write to 200 follower feeds| F1[Feed: Follower 1]
        FOW --> F2[Feed: Follower 2]
        FOW --> FN[Feed: Follower N]
        Note1["✓ Fast reads O(1)<br/>✗ Slow writes O(N followers)<br/>✗ Celebrity problem: 100M writes"]
    end

    subgraph "Fan-Out on Read (Pull Model)"
        Read1[User opens feed] --> FOR[Feed Builder]
        FOR -->|Query posts from 200 followees| P1[Posts by Followee 1]
        FOR --> P2[Posts by Followee 2]
        FOR --> PN[Posts by Followee N]
        FOR --> Merge[Merge + Rank]
        Note2["✓ No write amplification<br/>✗ Slow reads O(N followees)<br/>✓ Celebrity-friendly"]
    end
```

**Hybrid Approach (Production Solution):**

- **Regular users (< 10K followers):** Fan-out on write. Post is pushed to all followers' precomputed feed caches.
- **Celebrity users (> 10K followers):** Fan-out on read. Post is stored in the celebrity's timeline. When a follower fetches their feed, the system merges the precomputed cache with a live pull from followed celebrities.

This caps write amplification while keeping reads fast.

---

## Feed Generation Pipeline

```mermaid
sequenceDiagram
    participant U as User
    participant API as API Gateway
    participant Feed as Feed Service
    participant Cache as Feed Cache (Redis)
    participant Celeb as Celebrity Timeline
    participant Rank as ML Ranker
    participant Post as Post Store

    U->>API: GET /feed?cursor=abc123
    API->>Feed: Fetch feed
    Feed->>Cache: Get precomputed feed entries (IDs + scores)
    Cache-->>Feed: [{postId, timestamp}, ...] (top 500)
    Feed->>Celeb: Pull recent posts from followed celebrities
    Celeb-->>Feed: [{postId, timestamp}, ...]
    Feed->>Feed: Merge + Deduplicate
    Feed->>Rank: Score and rank merged candidates
    Rank-->>Feed: Ranked post IDs (top 50)
    Feed->>Post: Batch fetch post content (multi-get)
    Post-->>Feed: Full post objects with media URLs
    Feed-->>API: Paginated response (20 posts + next cursor)
    API-->>U: Feed page
```

**Cursor-Based Pagination:** Each response includes a `next_cursor` — an opaque token encoding the last item's ranking score and timestamp. The next request uses this cursor to fetch the next page. This avoids the offset drift problem of traditional pagination (new posts shift pages).

---

## Data Model

| Table          | Column              | Type               | Notes                               |
| -------------- | ------------------- | ------------------ | ----------------------------------- |
| `posts`        | `post_id`           | BIGINT (Snowflake) | Globally unique, time-ordered       |
|                | `author_id`         | BIGINT             | FK to users                         |
|                | `content`           | TEXT               | Post text                           |
|                | `media_ids`         | JSON               | Array of media object IDs           |
|                | `type`              | ENUM               | text / image / video / link / share |
|                | `created_at`        | TIMESTAMP          |                                     |
|                | `moderation_status` | ENUM               | pending / approved / removed        |
| `feed_cache`   | (Redis Sorted Set)  |                    | Key: `feed:{userId}`                |
|                | `member`            | STRING             | post_id                             |
|                | `score`             | DOUBLE             | Timestamp or rank score             |
| `social_graph` | `follower_id`       | BIGINT             | Who follows                         |
|                | `followee_id`       | BIGINT             | Who is followed                     |
|                | `created_at`        | TIMESTAMP          |                                     |
| `engagements`  | `post_id`           | BIGINT             |                                     |
|                | `user_id`           | BIGINT             |                                     |
|                | `type`              | ENUM               | like / comment / share              |
|                | `created_at`        | TIMESTAMP          |                                     |

**Storage:** Posts in Vitess (sharded MySQL) by `author_id`. Feed cache in Redis sorted sets — each user's feed holds up to 500 post IDs sorted by relevance score. Social graph in TAO-like graph store or dedicated graph database.

---

## Feed Ranking (ML-Based)

```mermaid
graph LR
    subgraph "Feature Extraction"
        Post[Post Features<br/>- age, type, media<br/>- author engagement rate<br/>- content embedding]
        User[User Features<br/>- past interactions<br/>- time of day<br/>- device type]
        Social[Social Features<br/>- closeness score<br/>- mutual friends<br/>- interaction frequency]
    end

    Post & User & Social --> Model[Ranking Model<br/>Two-Tower Neural Net<br/>Trained on click/like/comment<br/>Served via TF Serving]

    Model --> Score[Relevance Score<br/>0.0 - 1.0]
    Score --> Rules[Business Rules Layer<br/>- Diversity: no 3 posts from same author<br/>- Freshness boost for < 1hr posts<br/>- Dedup reshares]
    Rules --> Final[Final Ranked Feed]
```

The ranker is a two-stage system: a **candidate generator** (lightweight model selecting ~500 candidates) followed by a **precision ranker** (heavy model scoring the 500 candidates). This keeps inference under 100ms even at 500M DAU.

---

## Scaling & Bottlenecks

| Bottleneck                        | Mitigation                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------- |
| Fan-out storm from celebrity post | Hybrid approach: celebrities use fan-out on read, never write to follower caches |
| Redis memory for 500M feed caches | 500M users × 500 IDs × 16 bytes ≈ 4TB; shard across 50+ Redis nodes              |
| ML ranking latency                | Two-stage ranking; precompute embeddings; serve via GPU inference pods           |
| Post store read amplification     | Multi-get with in-memory cache (Memcached) in front of Vitess                    |
| Social graph queries              | TAO-like system with aggressive caching; denormalize follower lists              |
| Real-time feed updates            | WebSocket push for active users; pull-on-refresh for inactive                    |

**Feed Cache Eviction:** Each user's sorted set is capped at 500 entries. When a new post is fan-out-written, the lowest-scored entry is evicted. Users who haven't logged in for 30+ days have their feed cache expired entirely — it's rebuilt on next login.

---

## Industry Problems

### Problem 1: Fan-Out for a Celebrity With 100M Followers

When a celebrity with 100M followers posts, fan-out on write means inserting into 100M Redis sorted sets — at ~50K writes/second per Redis shard, that's 2,000 seconds (33 minutes) just for one post.

```mermaid
graph TB
    subgraph "Celebrity Post Flow"
        Celebrity[Celebrity Posts] --> PostStore[Post Store<br/>Single Write]
        PostStore --> Timeline[Celebrity Timeline<br/>Chronological List]

        Follower[Follower Reads Feed] --> FeedSvc[Feed Service]
        FeedSvc --> Cache[Precomputed Feed<br/>From Normal Users]
        FeedSvc --> Pull[Pull Celebrity Timelines<br/>Only followed celebrities]
        Cache & Pull --> Merge[Merge + Rank<br/>Combine Both Sources]
        Merge --> Response[Feed Response]
    end
```

**Solution:** Celebrity posts are never fanned out. They live in the celebrity's own timeline. When a follower loads their feed, the system pulls posts from followed celebrities (typically < 50 celebrity followees) and merges with the precomputed cache. The merge adds ~20ms to read latency — a worthwhile trade-off vs. 33 minutes of write propagation.

### Problem 2: Real-Time Feed Updates Without Polling

Users expect to see new posts without refreshing. Polling every 5 seconds from 500M users would generate 100M requests/second of mostly-empty responses.

```mermaid
sequenceDiagram
    participant U as User (Active)
    participant WS as WebSocket Gateway
    participant FanOut as Fan-Out Service
    participant Post as New Post Published

    Post->>FanOut: Fan-out to followers
    FanOut->>FanOut: Check: is follower online?
    alt Follower is Online
        FanOut->>WS: Push notification to gateway
        WS->>U: WebSocket: "3 new posts available"
        U->>U: User taps "Show new posts"
        U->>WS: GET /feed?since=cursor
    else Follower is Offline
        FanOut->>FanOut: Write to feed cache only
        Note over U: User sees new posts on next feed load
    end
```

**Solution:** Long-lived WebSocket connections for active users. When new posts are fanned out, the system checks if the follower is currently online (presence bit in Redis). If yes, a lightweight "new posts available" notification is pushed via WebSocket. The client then does a targeted fetch for just the new posts. This reduces polling to zero while keeping the feed fresh.

### Problem 3: ML-Based Feed Ranking at 500M DAU

With 10B feed reads/day and ~500 candidates to score per read, the ranking model must perform 5 trillion inferences per day — roughly 58M inferences per second.

**Solution:** Two-stage ranking. Stage 1 (candidate selection) uses a lightweight model (logistic regression) to narrow 500 candidates to 50. Stage 2 (precision ranking) uses a deep neural network to rank the final 50. Pre-computed user and item embeddings are cached in Redis, so inference only computes the interaction features. GPU inference pods with batching handle throughput. Feature logging to a feature store enables offline training.

### Problem 4: Content Moderation at 2B Posts/Day

At 2B posts/day (~23K posts/second), moderation must be automated, real-time, and accurate enough to catch harmful content before it reaches feeds.

```mermaid
graph TB
    subgraph "Content Moderation Pipeline"
        Post[New Post] --> PreCheck[Pre-Screen<br/>Blocklist + Regex<br/>~1ms]
        PreCheck -->|Pass| ML1[ML Classifier<br/>Text: Toxicity Model<br/>Image: NSFW Detector<br/>~50ms]
        PreCheck -->|Block| Removed[Removed]

        ML1 -->|Safe > 0.95| Approved[Approved<br/>→ Fan-Out]
        ML1 -->|Unsafe > 0.90| Removed
        ML1 -->|Uncertain| Queue[Human Review Queue]

        Queue --> Reviewer[Human Moderator]
        Reviewer --> Approved
        Reviewer --> Removed
    end

    subgraph "Feedback Loop"
        Approved --> UserReport[User Reports]
        UserReport --> ML1
        UserReport --> Reviewer
    end
```

**Solution:** Three-tier moderation. Tier 1: keyword blocklist and regex patterns (catches obvious spam, ~1ms). Tier 2: ML classifiers for toxicity, NSFW, and misinformation (runs asynchronously, ~50ms). Tier 3: human review for borderline cases. Posts flagged between 0.5–0.9 confidence enter a human queue. The system errs on the side of showing content and relying on user reports for false negatives — removing content is an asynchronous correction.

### Problem 5: Handling Mixed Media Types

A single feed page might contain text posts, images, videos, link previews, and reshares — each requiring different processing pipelines, storage, and rendering.

**Solution:** Unified post schema with a `type` field and extensible `media_ids` reference. Each media type has its own processing pipeline (image resizing, video transcoding, link preview extraction via Open Graph scraping) that runs asynchronously. The post is immediately available with a placeholder; media URLs are populated once processing completes. The feed response includes pre-computed layout hints (aspect ratios, durations, thumbnail URLs) so clients can render without additional fetches.

---

## Anti-Patterns & Common Mistakes

- **Pure fan-out on write** — Works for small-scale social networks but collapses under celebrity-follower power law distributions
- **Chronological-only feed** — Without ranking, users see the most recent posts, not the most relevant; engagement drops
- **Offset-based pagination** — New posts shift all offsets, causing duplicate or missed posts; always use cursor-based
- **Synchronous moderation in the write path** — Blocking post creation on ML inference adds 50ms+ latency; run moderation asynchronously with a short approval delay
- **Monolithic feed cache** — Storing the entire feed as a single blob prevents incremental updates; use sorted sets with individual post entries
- **Ignoring cold-start users** — New users with no connections see an empty feed; bootstrap with trending/recommended content

---

> **Key Takeaway:** The news feed is defined by the fan-out problem. Pure push (fan-out on write) is fast to read but crushes write infrastructure for celebrities. Pure pull (fan-out on read) scales writes but makes reads expensive. The hybrid approach — push for regular users, pull for celebrities, merge at read time — is the industry-standard solution. Ranking transforms a chronological stream into an engaging, personalized experience, but adds inference cost that demands two-stage architectures.
