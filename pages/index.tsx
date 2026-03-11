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
  Zap,
  Radio,
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
  return { props: { menu } };
}

const LLD_CATEGORIES = [
  {
    icon: <BookOpen size={22} />,
    title: "Creational Patterns",
    desc: "Singleton, Factory, Builder, Prototype — flexible object creation strategies.",
    href: "/lld/creational",
    color: "#3b82f6",
    tag: "5 patterns",
  },
  {
    icon: <Layers size={22} />,
    title: "Structural Patterns",
    desc: "Adapter, Decorator, Facade, Proxy — compose and wrap objects cleanly.",
    href: "/lld/structural",
    color: "#10b981",
    tag: "7 patterns",
  },
  {
    icon: <GitBranch size={22} />,
    title: "Behavioral Patterns",
    desc: "Observer, Strategy, Command, State — define how objects collaborate.",
    href: "/lld/behavioral",
    color: "#f59e0b",
    tag: "11 patterns",
  },
  {
    icon: <Shield size={22} />,
    title: "SOLID Principles",
    desc: "SRP, OCP, LSP, ISP, DIP — the foundations of maintainable design.",
    href: "/lld/solid",
    color: "#8b5cf6",
    tag: "5 principles",
  },
];

const HLD_CATEGORIES = [
  {
    icon: <Globe size={22} />,
    title: "Fundamentals",
    desc: "Scalability, Load Balancing, Caching, CDN — core building blocks.",
    href: "/hld/fundamentals",
    color: "#3b82f6",
    tag: "4 topics",
  },
  {
    icon: <Database size={22} />,
    title: "Data Systems",
    desc: "Sharding, Replication, SQL vs NoSQL — master data at scale.",
    href: "/hld/data-systems",
    color: "#10b981",
    tag: "4 topics",
  },
  {
    icon: <Network size={22} />,
    title: "Distributed Systems",
    desc: "CAP Theorem, Consensus, Transactions — theory meets practice.",
    href: "/hld/distributed-systems",
    color: "#f59e0b",
    tag: "4 topics",
  },
  {
    icon: <Boxes size={22} />,
    title: "Architecture Patterns",
    desc: "Microservices, Event-Driven, CQRS, API Gateway — modern blueprints.",
    href: "/hld/architecture",
    color: "#8b5cf6",
    tag: "4 topics",
  },
  {
    icon: <Server size={22} />,
    title: "Case Studies",
    desc: "URL Shortener, Chat, News Feed, Video Streaming — end-to-end design.",
    href: "/hld/case-studies",
    color: "#ef4444",
    tag: "4 studies",
  },
];

const STATS = [
  { num: "20+", label: "Design Patterns", icon: <GitBranch size={18} /> },
  { num: "20+", label: "HLD Topics", icon: <Network size={18} /> },
  { num: "100+", label: "Industry Problems", icon: <Zap size={18} /> },
  { num: "5", label: "Languages", icon: <Code2 size={18} /> },
];

const LANGUAGES = ["Python", "TypeScript", "Go", "Java", "Rust"];

const TOPICS = [
  { icon: <Code2 size={20} />, title: "Algorithms & DSA", desc: "Data structures, sorting, graphs, dynamic programming.", color: "#3b82f6" },
  { icon: <Cpu size={20} />, title: "Microservices", desc: "Build and decompose distributed service architectures.", color: "#10b981" },
  { icon: <Radio size={20} />, title: "Tech Libraries", desc: "Kafka, Spark, Raft, Redis — how major tools work inside.", color: "#f59e0b" },
  { icon: <Layout size={20} />, title: "Frontend", desc: "React, performance patterns, and modern UI architecture.", color: "#6366f1" },
  { icon: <Database size={20} />, title: "Databases", desc: "SQL, NoSQL, indexing strategies, query optimization.", color: "#ec4899" },
  { icon: <Users size={20} />, title: "Interview Prep", desc: "Real-world problems with walkthroughs and strategies.", color: "#14b8a6" },
];

export default function Home({ menu }: { menu: any }) {
  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="home__hero">
        <div className="home__hero-grid-bg" aria-hidden="true" />
        <div className="home__hero-glow" aria-hidden="true" />
        <div className="home__hero-content">
          <div className="home__hero-badge">
            <span className="home__hero-badge-dot" />
            Open Source · Free Forever
          </div>
          <h1 className="home__hero-title">
            Master Software Design
            <br />
            <span className="home__hero-accent">From Code to Architecture</span>
          </h1>
          <p className="home__hero-subtitle">
            Deep-dive into design patterns, system design, and real-world case
            studies — with interactive class diagrams and side-by-side code in
          </p>
          <div className="home__hero-langs">
            {LANGUAGES.map((l) => (
              <span key={l} className="home__hero-lang">{l}</span>
            ))}
          </div>
          <div className="home__hero-actions">
            <Link href="/lld" className="home__btn home__btn--primary">
              Design Patterns <ArrowRight size={16} />
            </Link>
            <Link href="/hld" className="home__btn home__btn--outline">
              System Design <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="home__stats">
        {STATS.map((s) => (
          <div key={s.label} className="home__stat">
            <div className="home__stat-icon">{s.icon}</div>
            <span className="home__stat-num">{s.num}</span>
            <span className="home__stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── LLD ── */}
      <section className="home__section">
        <div className="home__section-inner">
          <div className="home__section-eyebrow">Low Level Design</div>
          <h2 className="home__section-title">Design Patterns</h2>
          <p className="home__section-subtitle">
            Gang-of-Four patterns with interactive UML diagrams, multi-language
            examples, anti-patterns, and variant comparisons.
          </p>
          <div className="home__cards home__cards--4">
            {LLD_CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.href} className="home__card" style={{ "--card-accent": cat.color } as React.CSSProperties}>
                <div className="home__card-top">
                  <div className="home__card-icon" style={{ color: cat.color, background: `${cat.color}18` }}>
                    {cat.icon}
                  </div>
                  <span className="home__card-tag">{cat.tag}</span>
                </div>
                <h3 className="home__card-title">{cat.title}</h3>
                <p className="home__card-desc">{cat.desc}</p>
                <span className="home__card-cta" style={{ color: cat.color }}>
                  Explore <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HLD ── */}
      <section className="home__section home__section--alt">
        <div className="home__section-inner">
          <div className="home__section-eyebrow">High Level Design</div>
          <h2 className="home__section-title">System Design</h2>
          <p className="home__section-subtitle">
            Distributed systems theory, database internals, architecture
            patterns, and end-to-end case studies for interview and production.
          </p>
          <div className="home__cards home__cards--5">
            {HLD_CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.href} className="home__card" style={{ "--card-accent": cat.color } as React.CSSProperties}>
                <div className="home__card-top">
                  <div className="home__card-icon" style={{ color: cat.color, background: `${cat.color}18` }}>
                    {cat.icon}
                  </div>
                  <span className="home__card-tag">{cat.tag}</span>
                </div>
                <h3 className="home__card-title">{cat.title}</h3>
                <p className="home__card-desc">{cat.desc}</p>
                <span className="home__card-cta" style={{ color: cat.color }}>
                  Explore <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── More Topics ── */}
      <section className="home__section">
        <div className="home__section-inner">
          <div className="home__section-eyebrow">What's Inside</div>
          <h2 className="home__section-title">More Topics</h2>
          <p className="home__section-subtitle">
            From algorithms to tech tooling — everything you need for your
            engineering journey.
          </p>
          <div className="home__topics">
            {TOPICS.map((topic) => (
              <div key={topic.title} className="home__topic">
                <div className="home__topic-icon" style={{ color: topic.color, background: `${topic.color}18` }}>
                  {topic.icon}
                </div>
                <div>
                  <h4 className="home__topic-title">{topic.title}</h4>
                  <p className="home__topic-desc">{topic.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="home__cta">
        <div className="home__cta-glow" aria-hidden="true" />
        <div className="home__cta-inner">
          <div className="home__section-eyebrow home__section-eyebrow--light">Get Started</div>
          <h2 className="home__cta-title">Ready to level up?</h2>
          <p className="home__cta-subtitle">
            Start with design patterns or dive straight into system design —
            build a solid engineering foundation today.
          </p>
          <div className="home__hero-actions">
            <Link href="/lld" className="home__btn home__btn--white">
              Design Patterns <ArrowRight size={16} />
            </Link>
            <Link href="/hld" className="home__btn home__btn--outline-white">
              System Design <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
