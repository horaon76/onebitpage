import Link from "next/link";
import { LLD_CATEGORIES } from "@/lib/lldContent";
import { BookOpen, Layers, GitBranch, Shield, ArrowRight } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  creational: <BookOpen size={28} />,
  structural: <Layers size={28} />,
  behavioral: <GitBranch size={28} />,
  solid: <Shield size={28} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  creational: "#3b82f6",
  structural: "#10b981",
  behavioral: "#f59e0b",
  solid: "#8b5cf6",
};

export default function LLDIndex() {
  return (
    <div className="lld-landing">
      <div className="lld-landing__hero">
        <h1>Low Level Design</h1>
        <p className="lld-landing__subtitle">
          Master design patterns and SOLID principles with real-world industry examples
          in <strong>Python</strong>, <strong>Go</strong>, <strong>Java</strong>, <strong>TypeScript</strong>, and <strong>Rust</strong>.
        </p>
        <div className="lld-landing__badges">
          <span className="lld-badge">5 Languages</span>
          <span className="lld-badge">20 Patterns</span>
          <span className="lld-badge">100 Industry Examples</span>
          <span className="lld-badge">UML Diagrams</span>
        </div>
      </div>

      <div className="lld-landing__domains">
        <h3>Industry Domains Covered</h3>
        <div className="lld-landing__domain-list">
          <span className="lld-domain-tag">Fintech &amp; Payments</span>
          <span className="lld-domain-tag">Healthcare &amp; MedTech</span>
          <span className="lld-domain-tag">E-Commerce &amp; Marketplace</span>
          <span className="lld-domain-tag">Media &amp; Streaming</span>
          <span className="lld-domain-tag">Logistics &amp; Supply Chain</span>
        </div>
      </div>

      <div className="lld-landing__categories">
        {LLD_CATEGORIES.map((cat) => (
          <div key={cat.slug} className="lld-category-card" style={{ borderTopColor: CATEGORY_COLORS[cat.slug] }}>
            <div className="lld-category-card__header">
              <span style={{ color: CATEGORY_COLORS[cat.slug] }}>{CATEGORY_ICONS[cat.slug]}</span>
              <h2>{cat.title}</h2>
            </div>
            <p className="lld-category-card__desc">{cat.description}</p>
            <ul className="lld-category-card__patterns">
              {cat.patterns.map((pat) => (
                <li key={pat.slug}>
                  <Link href={`/lld/${cat.slug}/${pat.slug}`} className="lld-pattern-link">
                    <span>{pat.title}</span>
                    <ArrowRight size={14} />
                  </Link>
                  <span className="lld-pattern-desc">{pat.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
