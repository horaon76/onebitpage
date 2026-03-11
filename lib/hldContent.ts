// HLD content structure — mirrors lldContent.ts pattern

export interface TopicInfo {
  slug: string;
  title: string;
  description: string;
}

export interface HLDCategoryInfo {
  slug: string;
  title: string;
  description: string;
  topics: TopicInfo[];
}

export const HLD_CATEGORIES: HLDCategoryInfo[] = [
  {
    slug: "fundamentals",
    title: "System Design Fundamentals",
    description:
      "Core building blocks every system designer must master — scaling, caching, load distribution, and content delivery.",
    topics: [
      { slug: "scalability", title: "Scalability", description: "Horizontal vs vertical scaling, stateless services, auto-scaling" },
      { slug: "load-balancing", title: "Load Balancing", description: "Algorithms, L4 vs L7, health checks, sticky sessions" },
      { slug: "caching", title: "Caching Strategies", description: "Cache-aside, write-through, TTL, eviction, cache stampede" },
      { slug: "cdn", title: "Content Delivery Networks", description: "Edge caching, origin shielding, cache invalidation at scale" },
    ],
  },
  {
    slug: "data-systems",
    title: "Data Systems",
    description:
      "How to store, replicate, partition, and query data at scale — from relational databases to distributed object stores.",
    topics: [
      { slug: "database-sharding", title: "Database Sharding", description: "Range, hash, directory-based sharding, re-sharding" },
      { slug: "replication", title: "Replication & Failover", description: "Leader-follower, multi-leader, quorum reads/writes" },
      { slug: "sql-vs-nosql", title: "SQL vs NoSQL", description: "ACID vs BASE, document vs wide-column, choosing the right store" },
      { slug: "data-partitioning", title: "Data Partitioning", description: "Consistent hashing, partition strategies, hot-spot mitigation" },
    ],
  },
  {
    slug: "distributed-systems",
    title: "Distributed Systems",
    description:
      "The theory and practice of building reliable systems across unreliable networks — consensus, transactions, and discovery.",
    topics: [
      { slug: "cap-theorem", title: "CAP Theorem", description: "Consistency, availability, partition tolerance — trade-offs in practice" },
      { slug: "consensus", title: "Consensus Algorithms", description: "Raft, Paxos, leader election, distributed locks" },
      { slug: "distributed-transactions", title: "Distributed Transactions", description: "2PC, saga pattern, compensating actions, idempotency" },
      { slug: "service-discovery", title: "Service Discovery", description: "Client-side vs server-side, DNS, service mesh, health checks" },
    ],
  },
  {
    slug: "architecture",
    title: "Architecture Patterns",
    description:
      "High-level architectural styles for structuring large-scale applications — from monoliths to event-driven microservices.",
    topics: [
      { slug: "microservices", title: "Microservices Architecture", description: "Bounded contexts, service decomposition, data ownership" },
      { slug: "event-driven", title: "Event-Driven Architecture", description: "Event sourcing, pub/sub, message brokers, eventual consistency" },
      { slug: "cqrs", title: "CQRS", description: "Command Query Responsibility Segregation, read/write split" },
      { slug: "api-gateway", title: "API Gateway", description: "Routing, rate limiting, auth, aggregation, BFF pattern" },
    ],
  },
  {
    slug: "case-studies",
    title: "Case Studies",
    description:
      "End-to-end system design walk-throughs of real-world products — architecture diagrams, trade-offs, and scaling strategies.",
    topics: [
      { slug: "url-shortener", title: "URL Shortener", description: "Design TinyURL — encoding, redirection, analytics, abuse prevention" },
      { slug: "chat-system", title: "Chat System", description: "Design WhatsApp — real-time messaging, presence, delivery receipts" },
      { slug: "news-feed", title: "News Feed", description: "Design Facebook/Twitter feed — fan-out, ranking, pagination" },
      { slug: "video-streaming", title: "Video Streaming", description: "Design YouTube/Netflix — upload pipeline, transcoding, adaptive streaming" },
    ],
  },
];

// Map topic slug → markdown file path
export const HLD_CONTENT_FILE_MAP: Record<string, string> = {
  // Fundamentals
  "fundamentals/scalability": "content/2_HLD/1_Fundamentals/1_Scalability.md",
  "fundamentals/load-balancing": "content/2_HLD/1_Fundamentals/2_LoadBalancing.md",
  "fundamentals/caching": "content/2_HLD/1_Fundamentals/3_Caching.md",
  "fundamentals/cdn": "content/2_HLD/1_Fundamentals/4_CDN.md",
  // Data Systems
  "data-systems/database-sharding": "content/2_HLD/2_DataSystems/1_DatabaseSharding.md",
  "data-systems/replication": "content/2_HLD/2_DataSystems/2_Replication.md",
  "data-systems/sql-vs-nosql": "content/2_HLD/2_DataSystems/3_SQLvsNoSQL.md",
  "data-systems/data-partitioning": "content/2_HLD/2_DataSystems/4_DataPartitioning.md",
  // Distributed Systems
  "distributed-systems/cap-theorem": "content/2_HLD/3_DistributedSystems/1_CAPTheorem.md",
  "distributed-systems/consensus": "content/2_HLD/3_DistributedSystems/2_Consensus.md",
  "distributed-systems/distributed-transactions": "content/2_HLD/3_DistributedSystems/3_DistributedTransactions.md",
  "distributed-systems/service-discovery": "content/2_HLD/3_DistributedSystems/4_ServiceDiscovery.md",
  // Architecture
  "architecture/microservices": "content/2_HLD/4_Architecture/1_Microservices.md",
  "architecture/event-driven": "content/2_HLD/4_Architecture/2_EventDriven.md",
  "architecture/cqrs": "content/2_HLD/4_Architecture/3_CQRS.md",
  "architecture/api-gateway": "content/2_HLD/4_Architecture/4_APIGateway.md",
  // Case Studies
  "case-studies/url-shortener": "content/2_HLD/5_CaseStudies/1_URLShortener.md",
  "case-studies/chat-system": "content/2_HLD/5_CaseStudies/2_ChatSystem.md",
  "case-studies/news-feed": "content/2_HLD/5_CaseStudies/3_NewsFeed.md",
  "case-studies/video-streaming": "content/2_HLD/5_CaseStudies/4_VideoStreaming.md",
};

export function getHLDCategoryBySlug(slug: string): HLDCategoryInfo | undefined {
  return HLD_CATEGORIES.find((c) => c.slug === slug);
}

export function getTopicBySlug(category: string, topic: string): TopicInfo | undefined {
  const cat = getHLDCategoryBySlug(category);
  return cat?.topics.find((t) => t.slug === topic);
}

export function getAllTopicPaths(): { category: string; topic: string }[] {
  const paths: { category: string; topic: string }[] = [];
  for (const cat of HLD_CATEGORIES) {
    for (const top of cat.topics) {
      paths.push({ category: cat.slug, topic: top.slug });
    }
  }
  return paths;
}
