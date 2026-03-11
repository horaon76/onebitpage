import Link from "next/link";
import { HLD_CATEGORIES } from "@/lib/hldContent";
import { Server, Database, Network, Boxes, BookOpen, ArrowRight } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  fundamentals: <Server size={28} />,
  "data-systems": <Database size={28} />,
  "distributed-systems": <Network size={28} />,
  architecture: <Boxes size={28} />,
  "case-studies": <BookOpen size={28} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  fundamentals: "#3b82f6",
  "data-systems": "#10b981",
  "distributed-systems": "#f59e0b",
  architecture: "#8b5cf6",
  "case-studies": "#ef4444",
};

export default function HLDIndex() {
  return (
    <div className="lld-landing">
      <div className="lld-landing__hero">
        <h1>High Level Design</h1>
        <p className="lld-landing__subtitle">
          Master system design with real-world architecture patterns, distributed systems theory,
          and end-to-end case studies covering <strong>20 industry problems</strong> with mermaid diagrams.
        </p>
        <div className="lld-landing__badges">
          <span className="lld-badge">5 Categories</span>
          <span className="lld-badge">20 Topics</span>
          <span className="lld-badge">Architecture Diagrams</span>
          <span className="lld-badge">Industry Problems</span>
        </div>
      </div>

      <div className="lld-landing__domains">
        <h3>Key Concepts Covered</h3>
        <div className="lld-landing__domain-list">
          <span className="lld-domain-tag">Scalability</span>
          <span className="lld-domain-tag">Database Design</span>
          <span className="lld-domain-tag">Distributed Systems</span>
          <span className="lld-domain-tag">Microservices</span>
          <span className="lld-domain-tag">Event Sourcing</span>
          <span className="lld-domain-tag">System Design Interviews</span>
        </div>
      </div>

      <div className="lld-landing__categories">
        {HLD_CATEGORIES.map((cat) => (
          <div key={cat.slug} className="lld-category-card" style={{ borderTopColor: CATEGORY_COLORS[cat.slug] }}>
            <div className="lld-category-card__header">
              <span style={{ color: CATEGORY_COLORS[cat.slug] }}>{CATEGORY_ICONS[cat.slug]}</span>
              <h2>{cat.title}</h2>
            </div>
            <p className="lld-category-card__desc">{cat.description}</p>
            <ul className="lld-category-card__patterns">
              {cat.topics.map((topic) => (
                <li key={topic.slug}>
                  <Link href={`/hld/${cat.slug}/${topic.slug}`} className="lld-pattern-link">
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
