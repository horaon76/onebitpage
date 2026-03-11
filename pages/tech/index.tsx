import Link from "next/link";
import { TECH_CATEGORIES } from "@/lib/techContent";
import { Radio, Cpu, GitBranch, Database, Server, ArrowRight } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "message-queues":         <Radio size={28} />,
  "data-processing":        <Cpu size={28} />,
  "consensus-coordination": <GitBranch size={28} />,
  "databases-internals":    <Database size={28} />,
  infrastructure:           <Server size={28} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  "message-queues":         "#f59e0b",
  "data-processing":        "#3b82f6",
  "consensus-coordination": "#8b5cf6",
  "databases-internals":    "#10b981",
  infrastructure:           "#ef4444",
};

export default function TechIndex() {
  return (
    <div className="lld-landing">
      <div className="lld-landing__hero">
        <h1>Tech Deep Dives</h1>
        <p className="lld-landing__subtitle">
          In-depth explorations of the libraries, tools, and architectures that power modern
          distributed systems — from Kafka internals to Raft consensus to Kubernetes scheduling.
          Built for engineers who want to understand <strong>how things actually work</strong>.
        </p>
        <div className="lld-landing__badges">
          <span className="lld-badge">5 Categories</span>
          <span className="lld-badge">20 Topics</span>
          <span className="lld-badge">Internal Architecture</span>
          <span className="lld-badge">Industry Tools</span>
        </div>
      </div>

      <div className="lld-landing__domains">
        <h3>Technologies Covered</h3>
        <div className="lld-landing__domain-list">
          <span className="lld-domain-tag">Apache Kafka</span>
          <span className="lld-domain-tag">Apache Spark</span>
          <span className="lld-domain-tag">Raft Consensus</span>
          <span className="lld-domain-tag">PostgreSQL</span>
          <span className="lld-domain-tag">Kubernetes</span>
          <span className="lld-domain-tag">gRPC</span>
          <span className="lld-domain-tag">Apache Flink</span>
          <span className="lld-domain-tag">etcd</span>
        </div>
      </div>

      <div className="lld-landing__categories">
        {TECH_CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            className="lld-category-card"
            style={{ borderTopColor: CATEGORY_COLORS[cat.slug] }}
          >
            <div className="lld-category-card__header">
              <span style={{ color: CATEGORY_COLORS[cat.slug] }}>
                {CATEGORY_ICONS[cat.slug]}
              </span>
              <h2>{cat.title}</h2>
            </div>
            <p className="lld-category-card__desc">{cat.description}</p>
            <ul className="lld-category-card__patterns">
              {cat.topics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/tech/${cat.slug}/${topic.slug}`}
                    className="lld-pattern-link"
                  >
                    <span>{topic.title}</span>
                    <ArrowRight size={14} />
                  </Link>
                  <span className="lld-pattern-desc">{topic.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
