/**
 * Build-time script: generates public/search-index.json
 * Run via: node scripts/build-search-index.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const index = [];

// ── LLD Patterns ──────────────────────────────────────────────────
const LLD = [
  // Creational
  { c: "creational", cLabel: "Creational Patterns", s: "singleton",         t: "Singleton",               d: "Ensure a class has only one instance with global access" },
  { c: "creational", cLabel: "Creational Patterns", s: "factory-method",    t: "Factory Method",          d: "Define an interface for creating objects; let subclasses decide the concrete type" },
  { c: "creational", cLabel: "Creational Patterns", s: "abstract-factory",  t: "Abstract Factory",        d: "Create families of related objects without specifying concrete classes" },
  { c: "creational", cLabel: "Creational Patterns", s: "builder",           t: "Builder",                 d: "Construct complex objects step by step using the same construction process" },
  { c: "creational", cLabel: "Creational Patterns", s: "prototype",         t: "Prototype",               d: "Create new objects by cloning existing ones" },
  // Structural
  { c: "structural", cLabel: "Structural Patterns", s: "adapter",           t: "Adapter",                 d: "Allow incompatible interfaces to work together by wrapping one in a translator" },
  { c: "structural", cLabel: "Structural Patterns", s: "bridge",            t: "Bridge",                  d: "Decouple an abstraction from its implementation so both can vary independently" },
  { c: "structural", cLabel: "Structural Patterns", s: "composite",         t: "Composite",               d: "Compose objects into tree structures and treat individual objects and compositions uniformly" },
  { c: "structural", cLabel: "Structural Patterns", s: "decorator",         t: "Decorator",               d: "Attach additional responsibilities to an object dynamically" },
  { c: "structural", cLabel: "Structural Patterns", s: "facade",            t: "Facade",                  d: "Provide a simplified interface to a library, framework, or complex subsystem" },
  { c: "structural", cLabel: "Structural Patterns", s: "flyweight",         t: "Flyweight",               d: "Share common state to support large numbers of fine-grained objects efficiently" },
  { c: "structural", cLabel: "Structural Patterns", s: "proxy",             t: "Proxy",                   d: "Provide a surrogate or placeholder that controls access to another object" },
  // Behavioral
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "chain-of-responsibility", t: "Chain of Responsibility", d: "Pass requests along a chain of handlers, each deciding to process or pass on" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "command",           t: "Command",                 d: "Encapsulate a request as an object to support undo, queuing, and logging" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "interpreter",       t: "Interpreter",             d: "Define a grammar for a language and provide an interpreter to evaluate sentences" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "iterator",          t: "Iterator",                d: "Provide a way to sequentially access elements of a collection without exposing its representation" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "mediator",          t: "Mediator",                d: "Define an object that encapsulates how a set of objects interact, promoting loose coupling" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "memento",           t: "Memento",                 d: "Capture and restore an object's internal state without violating encapsulation" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "observer",          t: "Observer",                d: "Define a subscription mechanism to notify multiple objects of state changes" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "state",             t: "State",                   d: "Allow an object to alter its behavior when its internal state changes" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "strategy",          t: "Strategy",                d: "Define a family of algorithms, encapsulate each one, and make them interchangeable" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "template-method",   t: "Template Method",         d: "Define the skeleton of an algorithm in a base class, deferring steps to subclasses" },
  { c: "behavioral", cLabel: "Behavioral Patterns", s: "visitor",           t: "Visitor",                 d: "Separate an algorithm from the object structure it operates on using double dispatch" },
  // SOLID
  { c: "solid",      cLabel: "SOLID Principles",    s: "single-responsibility",  t: "Single Responsibility",   d: "A class should have only one reason to change" },
  { c: "solid",      cLabel: "SOLID Principles",    s: "open-closed",            t: "Open/Closed Principle",   d: "Software entities should be open for extension but closed for modification" },
  { c: "solid",      cLabel: "SOLID Principles",    s: "liskov-substitution",    t: "Liskov Substitution",     d: "Subtypes must be substitutable for their base types without altering correctness" },
  { c: "solid",      cLabel: "SOLID Principles",    s: "interface-segregation",  t: "Interface Segregation",   d: "Clients should not be forced to depend on interfaces they don't use" },
  { c: "solid",      cLabel: "SOLID Principles",    s: "dependency-inversion",   t: "Dependency Inversion",    d: "Depend on abstractions, not on concretions" },
];

for (const p of LLD) {
  index.push({
    id: `lld-${p.c}-${p.s}`,
    title: p.t,
    description: p.d,
    url: `/lld/${p.c}/${p.s}`,
    category: p.cLabel,
    type: "pattern",
  });
}

// ── HLD Markdown files ─────────────────────────────────────────────
const HLD_DIR_TO_SLUG = {
  "1_Fundamentals":       "fundamentals",
  "2_DataSystems":        "data-systems",
  "3_DistributedSystems": "distributed-systems",
  "4_Architecture":       "architecture",
  "5_CaseStudies":        "case-studies",
};

const HLD_DIR_TO_LABEL = {
  "1_Fundamentals":       "Fundamentals",
  "2_DataSystems":        "Data Systems",
  "3_DistributedSystems": "Distributed Systems",
  "4_Architecture":       "Architecture Patterns",
  "5_CaseStudies":        "Case Studies",
};

const hldRoot = path.join(root, "content/2_HLD");
if (fs.existsSync(hldRoot)) {
  for (const subDir of fs.readdirSync(hldRoot)) {
    const categorySlug = HLD_DIR_TO_SLUG[subDir];
    if (!categorySlug) continue;
    const categoryLabel = HLD_DIR_TO_LABEL[subDir];
    const subPath = path.join(hldRoot, subDir);
    for (const file of fs.readdirSync(subPath).filter(f => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(subPath, file), "utf-8");
      const titleMatch = raw.match(/^#\s+(.+)/m);
      const title = titleMatch
        ? titleMatch[1].trim()
        : file.replace(/^\d+_/, "").replace(/\.md$/, "").replace(/([A-Z])/g, " $1").trim();
      // Grab first real paragraph (not a heading) as description
      const descMatch = raw.replace(/^#[^\n]+\n+/m, "").match(/^([A-Za-z][^\n]{30,200})/m);
      const description = descMatch ? descMatch[1].trim() : "";
      index.push({
        id: `hld-${categorySlug}-${file}`,
        title,
        description,
        url: `/hld/${categorySlug}`,
        category: categoryLabel,
        type: "hld",
      });
    }
  }
}

// ── Tech Insights (static list — expand when .md files are added) ──
const TECH = [
  { slug: "message-queues/kafka",            title: "Kafka Deep Dive",         description: "How Kafka achieves high throughput with partitioned, replicated logs",       category: "Message Queues" },
  { slug: "message-queues/rabbitmq",         title: "RabbitMQ",                description: "AMQP-based message broker with exchanges, queues, and routing keys",          category: "Message Queues" },
  { slug: "message-queues/pulsar",           title: "Apache Pulsar",           description: "Multi-tenant, geo-replicated messaging and streaming system",                  category: "Message Queues" },
  { slug: "message-queues/redis-streams",    title: "Redis Streams",           description: "Append-only log data structure built into Redis for stream processing",        category: "Message Queues" },
  { slug: "data-processing/spark",           title: "Spark Architecture",      description: "In-memory distributed computation engine — RDDs, DAGs, and shuffle",          category: "Data Processing" },
  { slug: "data-processing/flink",           title: "Apache Flink",            description: "Stateful stream processing with exactly-once semantics",                       category: "Data Processing" },
  { slug: "data-processing/hadoop",          title: "Hadoop & MapReduce",      description: "Distributed storage (HDFS) and batch computation with MapReduce",              category: "Data Processing" },
  { slug: "data-processing/dbt",             title: "dbt (Data Build Tool)",   description: "Transform data in your warehouse using SQL with dependency graphs",           category: "Data Processing" },
  { slug: "consensus-coordination/raft",     title: "Raft Consensus",          description: "Understandable distributed consensus algorithm — leader election and log replication", category: "Consensus & Coordination" },
  { slug: "consensus-coordination/paxos",    title: "Paxos",                   description: "Classic consensus algorithm for agreeing on a value in a distributed network", category: "Consensus & Coordination" },
  { slug: "consensus-coordination/zookeeper",title: "ZooKeeper",               description: "Centralized service for configuration, synchronization, and naming in distributed systems", category: "Consensus & Coordination" },
  { slug: "consensus-coordination/etcd",     title: "etcd",                    description: "Strongly consistent distributed key-value store powering Kubernetes",          category: "Consensus & Coordination" },
  { slug: "databases-internals/redis",       title: "Redis Internals",         description: "In-memory data structure store — how persistence, eviction, and clustering work", category: "Database Internals" },
  { slug: "databases-internals/postgresql",  title: "PostgreSQL Internals",    description: "MVCC, WAL, query planner, and VACUUM in PostgreSQL",                           category: "Database Internals" },
  { slug: "databases-internals/cassandra",   title: "Cassandra",               description: "Wide-column store with consistent hashing, SSTables, and tunable consistency", category: "Database Internals" },
  { slug: "databases-internals/rocksdb",     title: "RocksDB",                 description: "LSM-tree-based embedded key-value store optimized for fast storage",           category: "Database Internals" },
  { slug: "infrastructure/kubernetes",       title: "Kubernetes Internals",    description: "How the control plane, scheduler, kubelet, and etcd work together",            category: "Infrastructure" },
  { slug: "infrastructure/docker",           title: "Docker & Containers",     description: "Namespaces, cgroups, layered filesystems — containers from first principles", category: "Infrastructure" },
  { slug: "infrastructure/nginx",            title: "Nginx & Envoy",           description: "Reverse proxy, load balancing, and service mesh sidecar patterns",            category: "Infrastructure" },
  { slug: "infrastructure/grpc",             title: "gRPC",                    description: "Protocol Buffers, HTTP/2 streaming, and cross-language RPC",                  category: "Infrastructure" },
];

for (const t of TECH) {
  index.push({
    id: `tech-${t.slug.replace(/\//g, "-")}`,
    title: t.title,
    description: t.description,
    url: `/tech/${t.slug}`,
    category: t.category,
    type: "tech",
  });
}

// ── Write output ───────────────────────────────────────────────────
const out = path.join(root, "public/search-index.json");
fs.writeFileSync(out, JSON.stringify(index, null, 2));
console.log(`✓ Search index built: ${index.length} entries → public/search-index.json`);
