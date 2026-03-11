import Link from "next/link";
import fs from "fs";
import path from "path";
import {
  BookOpen,
  Layers,
  GitBranch,
  Shield,
  Code2,
  Server,
  Database,
  Layout,
  Users,
  ArrowRight,
  Cpu,
  Network,
  Boxes,
  Globe,
} from "lucide-react";

export async function getStaticProps() {
  let menu = {};

  try {
    const filePath = path.join(process.cwd(), "public", "content.json");
    const data = fs.readFileSync(filePath, "utf-8");
    menu = JSON.parse(data);
  } catch (err) {
    console.error("Error loading menu:", err);
  }

  return {
    props: { menu },
  };
}

const LLD_CATEGORIES = [
  {
    icon: <BookOpen size={24} />,
    title: "Creational Patterns",
    desc: "Singleton, Factory, Builder, Prototype — flexible object creation.",
    href: "/lld/creational",
    color: "#3b82f6",
  },
  {
    icon: <Layers size={24} />,
    title: "Structural Patterns",
    desc: "Adapter, Decorator, Facade, Proxy, Composite — compose objects.",
    href: "/lld/structural",
    color: "#10b981",
  },
  {
    icon: <GitBranch size={24} />,
    title: "Behavioral Patterns",
    desc: "Observer, Strategy, Command, State, Template Method — interactions.",
    href: "/lld/behavioral",
    color: "#f59e0b",
  },
  {
    icon: <Shield size={24} />,
    title: "SOLID Principles",
    desc: "SRP, OCP, LSP, ISP, DIP — foundations of clean design.",
    href: "/lld/solid",
    color: "#8b5cf6",
  },
];

const HLD_CATEGORIES = [
  {
    icon: <Globe size={24} />,
    title: "Fundamentals",
    desc: "Scalability, Load Balancing, Caching, CDN — core building blocks of distributed systems.",
    href: "/hld/fundamentals",
    color: "#3b82f6",
  },
  {
    icon: <Database size={24} />,
    title: "Data Systems",
    desc: "Sharding, Replication, SQL vs NoSQL, Partitioning — master data at scale.",
    href: "/hld/data-systems",
    color: "#10b981",
  },
  {
    icon: <Network size={24} />,
    title: "Distributed Systems",
    desc: "CAP Theorem, Consensus, Transactions, Service Discovery — theory meets practice.",
    href: "/hld/distributed-systems",
    color: "#f59e0b",
  },
  {
    icon: <Boxes size={24} />,
    title: "Architecture Patterns",
    desc: "Microservices, Event-Driven, CQRS, API Gateway — modern architecture blueprints.",
    href: "/hld/architecture",
    color: "#8b5cf6",
  },
  {
    icon: <Server size={24} />,
    title: "Case Studies",
    desc: "URL Shortener, Chat System, News Feed, Video Streaming — end-to-end system designs.",
    href: "/hld/case-studies",
    color: "#ef4444",
  },
];

const TOPICS = [
  { icon: <Code2 size={20} />, title: "Coding", desc: "Data structures, algorithms, and best practices." },
  { icon: <Cpu size={20} />, title: "Microservices", desc: "Build scalable distributed systems." },
  { icon: <Server size={20} />, title: "System Design", desc: "Architecture for scale and reliability." },
  { icon: <Layout size={20} />, title: "Frontend", desc: "React, performance, and modern UI." },
  { icon: <Database size={20} />, title: "Database", desc: "SQL, NoSQL, query optimization." },
  { icon: <Users size={20} />, title: "Interviews", desc: "Real experiences and strategies." },
];

export default function Home({ menu }: { menu: any }) {
  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-content">
          <div className="home__hero-badge">Open Source Learning Platform</div>
          <h1 className="home__hero-title">
            Master Software Design<br />
            <span className="home__hero-accent">From Code to Architecture</span>
          </h1>
          <p className="home__hero-subtitle">
            Low-level design patterns, high-level system design, and real-world case studies in{" "}
            <strong>Python</strong>, <strong>Go</strong>, <strong>Java</strong>,{" "}
            <strong>TypeScript</strong>, and <strong>Rust</strong> — with industry-scale examples.
          </p>
          <div className="home__hero-actions">
            <Link href="/lld" className="home__btn home__btn--primary">
              Explore LLD <ArrowRight size={16} />
            </Link>
            <Link href="/hld" className="home__btn home__btn--ghost">
              Explore HLD <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="home__stats">
        <div className="home__stats-inner">
          <div className="home__stat">
            <span className="home__stat-num">20</span>
            <span className="home__stat-label">Design Patterns</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-num">20</span>
            <span className="home__stat-label">HLD Topics</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-num">100+</span>
            <span className="home__stat-label">Industry Problems</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-num">5</span>
            <span className="home__stat-label">Languages</span>
          </div>
        </div>
      </section>

      {/* LLD Categories */}
      <section className="home__section">
        <div className="home__section-inner">
          <h2 className="home__section-title">Low Level Design</h2>
          <p className="home__section-subtitle">
            Battle-tested patterns explained with UML diagrams and multi-language implementations.
          </p>
          <div className="home__cards">
            {LLD_CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.href} className="home__card">
                <div className="home__card-icon" style={{ color: cat.color, background: `${cat.color}15` }}>
                  {cat.icon}
                </div>
                <h3 className="home__card-title">{cat.title}</h3>
                <p className="home__card-desc">{cat.desc}</p>
                <span className="home__card-cta" style={{ color: cat.color }}>
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HLD Categories */}
      <section className="home__section home__section--alt">
        <div className="home__section-inner">
          <h2 className="home__section-title">High Level Design</h2>
          <p className="home__section-subtitle">
            System design fundamentals, distributed systems, and end-to-end architecture case studies with detailed diagrams.
          </p>
          <div className="home__cards">
            {HLD_CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.href} className="home__card">
                <div className="home__card-icon" style={{ color: cat.color, background: `${cat.color}15` }}>
                  {cat.icon}
                </div>
                <h3 className="home__card-title">{cat.title}</h3>
                <p className="home__card-desc">{cat.desc}</p>
                <span className="home__card-cta" style={{ color: cat.color }}>
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="home__section">
        <div className="home__section-inner">
          <h2 className="home__section-title">More Topics</h2>
          <p className="home__section-subtitle">
            From algorithms to interviews — everything you need for your tech journey.
          </p>
          <div className="home__topics">
            {TOPICS.map((topic) => (
              <div key={topic.title} className="home__topic">
                <div className="home__topic-icon">{topic.icon}</div>
                <div>
                  <h4 className="home__topic-title">{topic.title}</h4>
                  <p className="home__topic-desc">{topic.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home__cta">
        <div className="home__cta-inner">
          <h2>Ready to level up?</h2>
          <p>Start with design patterns or dive into system design — build a solid engineering foundation.</p>
          <div className="home__hero-actions">
            <Link href="/lld" className="home__btn home__btn--primary">
              Start with LLD <ArrowRight size={16} />
            </Link>
            <Link href="/hld" className="home__btn home__btn--ghost">
              Start with HLD <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
