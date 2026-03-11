// Tech: Libraries, Tools & Architectures — Kafka, Spark, Raft, etc.

export interface TechTopicInfo {
  slug: string;
  title: string;
  description: string;
}

export interface TechCategoryInfo {
  slug: string;
  title: string;
  description: string;
  topics: TechTopicInfo[];
}

export const TECH_CATEGORIES: TechCategoryInfo[] = [
  {
    slug: "message-queues",
    title: "Message Queues & Streaming",
    description:
      "Deep dives into the internals of message brokers and streaming platforms — how Kafka achieves high throughput, how RabbitMQ routes messages, and when to choose each.",
    topics: [
      {
        slug: "kafka",
        title: "Apache Kafka",
        description: "Topics, partitions, consumer groups, log compaction, exactly-once semantics, Kafka Streams",
      },
      {
        slug: "rabbitmq",
        title: "RabbitMQ",
        description: "AMQP protocol, exchanges, queues, bindings, acknowledgements, dead-letter exchanges",
      },
      {
        slug: "pulsar",
        title: "Apache Pulsar",
        description: "Unified messaging & streaming, BookKeeper storage, multi-tenancy, geo-replication",
      },
      {
        slug: "redis-streams",
        title: "Redis Streams",
        description: "XADD/XREAD, consumer groups, message acknowledgement, persistence with AOF/RDB",
      },
    ],
  },
  {
    slug: "data-processing",
    title: "Data Processing Frameworks",
    description:
      "Batch and stream processing engines that power analytics at scale — from MapReduce origins to modern dataflow systems processing billions of events per day.",
    topics: [
      {
        slug: "spark",
        title: "Apache Spark",
        description: "RDDs, DataFrames, DAG execution, lazy evaluation, Spark SQL, Structured Streaming",
      },
      {
        slug: "flink",
        title: "Apache Flink",
        description: "Stateful stream processing, event time vs processing time, watermarks, checkpointing",
      },
      {
        slug: "hadoop",
        title: "Apache Hadoop & HDFS",
        description: "MapReduce model, HDFS block replication, NameNode architecture, YARN resource management",
      },
      {
        slug: "dbt",
        title: "dbt (data build tool)",
        description: "SQL-first transformation, DAG lineage, testing & documentation, incremental models",
      },
    ],
  },
  {
    slug: "consensus-coordination",
    title: "Consensus & Coordination",
    description:
      "The algorithms and systems that keep distributed nodes in agreement — leader election, replicated logs, distributed locks, and the theory behind fault-tolerant coordination.",
    topics: [
      {
        slug: "raft",
        title: "Raft Consensus",
        description: "Leader election, log replication, safety guarantees, joint consensus, implementations in etcd/TiKV",
      },
      {
        slug: "paxos",
        title: "Paxos",
        description: "Single-decree Paxos, Multi-Paxos, prepare/promise/accept phases, liveness vs safety",
      },
      {
        slug: "zookeeper",
        title: "Apache ZooKeeper",
        description: "ZAB protocol, znodes, watches, ephemeral nodes, recipes: locks, queues, barriers",
      },
      {
        slug: "etcd",
        title: "etcd",
        description: "Raft-backed KV store, MVCC, leases, watch API, use in Kubernetes as the control plane store",
      },
    ],
  },
  {
    slug: "databases-internals",
    title: "Database Internals",
    description:
      "Under the hood of databases — how B-trees and LSM trees work, how MVCC enables transactions, how Cassandra's ring topology distributes data, and when to choose column-family over relational.",
    topics: [
      {
        slug: "postgresql-internals",
        title: "PostgreSQL Internals",
        description: "MVCC, WAL, vacuum, EXPLAIN plans, index types (B-tree, GIN, BRIN), connection pooling",
      },
      {
        slug: "redis",
        title: "Redis Deep Dive",
        description: "Data structures internals, persistence (RDB/AOF), replication, Cluster mode, Lua scripting",
      },
      {
        slug: "cassandra",
        title: "Apache Cassandra",
        description: "Ring topology, consistent hashing, SSTables, compaction strategies, tunable consistency",
      },
      {
        slug: "rocksdb",
        title: "RocksDB & LSM Trees",
        description: "Log-structured merge trees, memtable/SSTable, compaction, bloom filters, column families",
      },
    ],
  },
  {
    slug: "infrastructure",
    title: "Infrastructure & Tooling",
    description:
      "The operational layer of modern systems — container orchestration with Kubernetes, high-performance proxying with Nginx/Envoy, inter-service communication with gRPC, and tracing with OpenTelemetry.",
    topics: [
      {
        slug: "kubernetes",
        title: "Kubernetes",
        description: "Pod scheduling, controllers, services, ingress, etcd control plane, Operators pattern",
      },
      {
        slug: "docker",
        title: "Docker & OCI",
        description: "Image layers, namespaces, cgroups, multi-stage builds, BuildKit, container networking",
      },
      {
        slug: "nginx",
        title: "Nginx & Envoy",
        description: "Event loop model, upstream balancing, SSL termination, Envoy xDS API, service mesh sidecar",
      },
      {
        slug: "grpc",
        title: "gRPC & Protobuf",
        description: "HTTP/2 multiplexing, binary encoding, code generation, streaming RPCs, health checking",
      },
    ],
  },
];

// Map "category/topic" → markdown file path (populate as articles are written)
export const TECH_CONTENT_FILE_MAP: Record<string, string> = {
  // Message Queues
  "message-queues/kafka":        "content/3_Tech/1_MessageQueues/kafka.md",
  "message-queues/rabbitmq":     "content/3_Tech/1_MessageQueues/rabbitmq.md",
  "message-queues/pulsar":       "content/3_Tech/1_MessageQueues/pulsar.md",
  "message-queues/redis-streams":"content/3_Tech/1_MessageQueues/redis-streams.md",
  // Data Processing
  "data-processing/spark":       "content/3_Tech/2_DataProcessing/spark.md",
  "data-processing/flink":       "content/3_Tech/2_DataProcessing/flink.md",
  "data-processing/hadoop":      "content/3_Tech/2_DataProcessing/hadoop.md",
  "data-processing/dbt":         "content/3_Tech/2_DataProcessing/dbt.md",
  // Consensus
  "consensus-coordination/raft":       "content/3_Tech/3_Consensus/raft.md",
  "consensus-coordination/paxos":      "content/3_Tech/3_Consensus/paxos.md",
  "consensus-coordination/zookeeper":  "content/3_Tech/3_Consensus/zookeeper.md",
  "consensus-coordination/etcd":       "content/3_Tech/3_Consensus/etcd.md",
  // Database Internals
  "databases-internals/postgresql-internals": "content/3_Tech/4_Databases/postgresql.md",
  "databases-internals/redis":                "content/3_Tech/4_Databases/redis.md",
  "databases-internals/cassandra":            "content/3_Tech/4_Databases/cassandra.md",
  "databases-internals/rocksdb":              "content/3_Tech/4_Databases/rocksdb.md",
  // Infrastructure
  "infrastructure/kubernetes": "content/3_Tech/5_Infrastructure/kubernetes.md",
  "infrastructure/docker":     "content/3_Tech/5_Infrastructure/docker.md",
  "infrastructure/nginx":      "content/3_Tech/5_Infrastructure/nginx.md",
  "infrastructure/grpc":       "content/3_Tech/5_Infrastructure/grpc.md",
};

export function getTechCategoryBySlug(slug: string): TechCategoryInfo | undefined {
  return TECH_CATEGORIES.find((c) => c.slug === slug);
}

export function getTechTopicBySlug(category: string, topic: string): TechTopicInfo | undefined {
  const cat = getTechCategoryBySlug(category);
  return cat?.topics.find((t) => t.slug === topic);
}

export function getAllTechTopicPaths(): { category: string; topic: string }[] {
  const paths: { category: string; topic: string }[] = [];
  for (const cat of TECH_CATEGORIES) {
    for (const top of cat.topics) {
      paths.push({ category: cat.slug, topic: top.slug });
    }
  }
  return paths;
}
