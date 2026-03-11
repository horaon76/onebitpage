import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LLD_CATEGORIES, CategoryInfo } from "@/lib/lldContent";
import { HLD_CATEGORIES, HLDCategoryInfo } from "@/lib/hldContent";
import { ChevronDown, ChevronRight, BookOpen, Layers, GitBranch, Shield, Menu, X, Server, Database, Network, Boxes } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const LLD_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  creational: <BookOpen size={16} />,
  structural: <Layers size={16} />,
  behavioral: <GitBranch size={16} />,
  solid: <Shield size={16} />,
};

const HLD_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  fundamentals: <Server size={16} />,
  "data-systems": <Database size={16} />,
  "distributed-systems": <Network size={16} />,
  architecture: <Boxes size={16} />,
  "case-studies": <BookOpen size={16} />,
};

interface TutorialLayoutProps {
  children: React.ReactNode;
  htmlContent?: string;
}

function TableOfContents({ html }: { html: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const items: { id: string; text: string; level: number }[] = [];
    doc.querySelectorAll("h2, h3").forEach((el) => {
      const level = el.tagName === "H2" ? 2 : 3;
      const text = el.textContent?.replace(/^#\s*/, "") || "";
      const id = el.id || text.toLowerCase().replace(/\s+/g, "-");
      if (text) items.push({ id, text, level });
    });
    setHeadings(items);
  }, [html]);

  if (headings.length === 0) return null;

  return (
    <nav className="tutorial-toc">
      <div className="tutorial-toc__title">On This Page</div>
      <ul className="tutorial-toc__list">
        {headings.map((h) => (
          <li key={h.id} className={`tutorial-toc__item tutorial-toc__item--l${h.level}`}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Sidebar() {
  const router = useRouter();
  const isHLD = router.pathname.startsWith("/hld");
  const { category: activeCategory, pattern: activePattern, topic: activeTopic } = router.query;
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (activeCategory) {
      setExpandedCategories((prev) => new Set([...prev, activeCategory as string]));
    }
  }, [activeCategory]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const sidebarContent = isHLD ? (
    <>
      <div className="tutorial-sidebar__header">
        <Link href="/hld" className="tutorial-sidebar__brand">
          <Server size={20} />
          <span>System Design</span>
        </Link>
      </div>
      <nav className="tutorial-sidebar__nav">
        {HLD_CATEGORIES.map((cat) => {
          const isExpanded = expandedCategories.has(cat.slug);
          const isCategoryActive = activeCategory === cat.slug;
          return (
            <div key={cat.slug} className="tutorial-sidebar__category">
              <button
                className={`tutorial-sidebar__category-btn ${isCategoryActive ? "active" : ""}`}
                onClick={() => toggleCategory(cat.slug)}
              >
                <span className="tutorial-sidebar__category-icon">
                  {HLD_CATEGORY_ICONS[cat.slug]}
                </span>
                <span className="tutorial-sidebar__category-label">{cat.title}</span>
                <span className="tutorial-sidebar__chevron">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>
              {isExpanded && (
                <ul className="tutorial-sidebar__patterns">
                  {cat.topics.map((topic) => {
                    const isActive = activeCategory === cat.slug && activeTopic === topic.slug;
                    return (
                      <li key={topic.slug}>
                        <Link
                          href={`/hld/${cat.slug}/${topic.slug}`}
                          className={`tutorial-sidebar__pattern-link ${isActive ? "active" : ""}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {topic.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </>
  ) : (
    <>
      <div className="tutorial-sidebar__header">
        <Link href="/lld" className="tutorial-sidebar__brand">
          <BookOpen size={20} />
          <span>Design Patterns</span>
        </Link>
      </div>
      <nav className="tutorial-sidebar__nav">
        {LLD_CATEGORIES.map((cat) => {
          const isExpanded = expandedCategories.has(cat.slug);
          const isCategoryActive = activeCategory === cat.slug;
          return (
            <div key={cat.slug} className="tutorial-sidebar__category">
              <button
                className={`tutorial-sidebar__category-btn ${isCategoryActive ? "active" : ""}`}
                onClick={() => toggleCategory(cat.slug)}
              >
                <span className="tutorial-sidebar__category-icon">
                  {LLD_CATEGORY_ICONS[cat.slug]}
                </span>
                <span className="tutorial-sidebar__category-label">{cat.title}</span>
                <span className="tutorial-sidebar__chevron">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>
              {isExpanded && (
                <ul className="tutorial-sidebar__patterns">
                  {cat.patterns.map((pat) => {
                    const isActive = activeCategory === cat.slug && activePattern === pat.slug;
                    return (
                      <li key={pat.slug}>
                        <Link
                          href={`/lld/${cat.slug}/${pat.slug}`}
                          className={`tutorial-sidebar__pattern-link ${isActive ? "active" : ""}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {pat.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <button className="tutorial-sidebar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside className={`tutorial-sidebar ${mobileOpen ? "tutorial-sidebar--open" : ""}`}>
        {sidebarContent}
      </aside>
      {mobileOpen && <div className="tutorial-sidebar__overlay" onClick={() => setMobileOpen(false)} />}
    </>
  );
}

export default function TutorialLayout({ children, htmlContent }: TutorialLayoutProps) {
  const { theme } = useTheme();

  useEffect(() => {
    const renderMermaid = async () => {
      if (typeof window === "undefined") return;
      const mermaid = (window as any).mermaid;
      if (!mermaid) return;

      const container = document.querySelector(".tutorial-content");
      if (!container) return;
      const nodes = container.querySelectorAll<HTMLElement>(".mermaid");
      if (nodes.length === 0) return;

      // Reset already-processed nodes so mermaid re-renders them
      nodes.forEach((el) => {
        const saved = el.getAttribute("data-mermaid-src");
        if (saved) {
          el.textContent = saved;
          el.removeAttribute("data-processed");
        } else {
          el.setAttribute("data-mermaid-src", el.textContent || "");
        }
      });

      const mermaidTheme = theme === "dark" ? "dark" : "default";
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: mermaidTheme,
          securityLevel: "loose",
        });
        await mermaid.run({ nodes: Array.from(nodes) });
      } catch (e) {
        console.error("Mermaid render error:", e);
      }

      // After rendering, wrap each diagram in a container with zoom/fullscreen controls
      nodes.forEach((el) => {
        // Skip if already wrapped
        if (el.parentElement?.classList.contains("mermaid-container")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "mermaid-container";

        // Controls toolbar
        const toolbar = document.createElement("div");
        toolbar.className = "mermaid-toolbar";

        const zoomState = { scale: 1, panX: 0, panY: 0, isPanning: false, startX: 0, startY: 0 };

        const viewport = document.createElement("div");
        viewport.className = "mermaid-viewport";

        const inner = document.createElement("div");
        inner.className = "mermaid-inner";

        // Move the mermaid element into the viewport
        el.parentNode?.insertBefore(wrapper, el);
        inner.appendChild(el);
        viewport.appendChild(inner);

        const applyTransform = () => {
          inner.style.transform = `translate(${zoomState.panX}px, ${zoomState.panY}px) scale(${zoomState.scale})`;
        };

        // Zoom In button
        const zoomInBtn = document.createElement("button");
        zoomInBtn.className = "mermaid-btn";
        zoomInBtn.title = "Zoom In";
        zoomInBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;
        zoomInBtn.onclick = () => {
          zoomState.scale = Math.min(zoomState.scale + 0.25, 4);
          applyTransform();
          zoomLabel.textContent = Math.round(zoomState.scale * 100) + "%";
        };

        // Zoom Out button
        const zoomOutBtn = document.createElement("button");
        zoomOutBtn.className = "mermaid-btn";
        zoomOutBtn.title = "Zoom Out";
        zoomOutBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;
        zoomOutBtn.onclick = () => {
          zoomState.scale = Math.max(zoomState.scale - 0.25, 0.25);
          applyTransform();
          zoomLabel.textContent = Math.round(zoomState.scale * 100) + "%";
        };

        // Reset button
        const resetBtn = document.createElement("button");
        resetBtn.className = "mermaid-btn";
        resetBtn.title = "Reset Zoom";
        resetBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;
        resetBtn.onclick = () => {
          zoomState.scale = 1;
          zoomState.panX = 0;
          zoomState.panY = 0;
          applyTransform();
          zoomLabel.textContent = "100%";
        };

        // Zoom label
        const zoomLabel = document.createElement("span");
        zoomLabel.className = "mermaid-zoom-label";
        zoomLabel.textContent = "100%";

        // Fullscreen button
        const fullscreenBtn = document.createElement("button");
        fullscreenBtn.className = "mermaid-btn";
        fullscreenBtn.title = "Toggle Fullscreen";
        fullscreenBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;

        const exitFullscreenSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
        const enterFullscreenSvg = fullscreenBtn.innerHTML;

        fullscreenBtn.onclick = () => {
          const isFullscreen = wrapper.classList.toggle("mermaid-container--fullscreen");
          fullscreenBtn.innerHTML = isFullscreen ? exitFullscreenSvg : enterFullscreenSvg;
          if (isFullscreen) {
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.overflow = "";
          }
        };

        // Scroll-wheel zoom
        viewport.addEventListener("wheel", (e) => {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          zoomState.scale = Math.min(Math.max(zoomState.scale + delta, 0.25), 4);
          applyTransform();
          zoomLabel.textContent = Math.round(zoomState.scale * 100) + "%";
        }, { passive: false });

        // Pan with mouse drag
        viewport.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return;
          zoomState.isPanning = true;
          zoomState.startX = e.clientX - zoomState.panX;
          zoomState.startY = e.clientY - zoomState.panY;
          viewport.style.cursor = "grabbing";
        });
        viewport.addEventListener("mousemove", (e) => {
          if (!zoomState.isPanning) return;
          zoomState.panX = e.clientX - zoomState.startX;
          zoomState.panY = e.clientY - zoomState.startY;
          applyTransform();
        });
        const stopPan = () => {
          zoomState.isPanning = false;
          viewport.style.cursor = "grab";
        };
        viewport.addEventListener("mouseup", stopPan);
        viewport.addEventListener("mouseleave", stopPan);

        // ESC to exit fullscreen
        const escHandler = (e: KeyboardEvent) => {
          if (e.key === "Escape" && wrapper.classList.contains("mermaid-container--fullscreen")) {
            wrapper.classList.remove("mermaid-container--fullscreen");
            fullscreenBtn.innerHTML = enterFullscreenSvg;
            document.body.style.overflow = "";
          }
        };
        document.addEventListener("keydown", escHandler);

        toolbar.appendChild(zoomOutBtn);
        toolbar.appendChild(zoomLabel);
        toolbar.appendChild(zoomInBtn);
        toolbar.appendChild(resetBtn);
        toolbar.appendChild(fullscreenBtn);

        wrapper.appendChild(toolbar);
        wrapper.appendChild(viewport);
      });
    };

    const timer = setTimeout(renderMermaid, 50);
    return () => clearTimeout(timer);
  }, [htmlContent, theme]);

  return (
    <div className="tutorial-layout">
      <Sidebar />
      <div className="tutorial-main">
        <div className="tutorial-content">{children}</div>
        {htmlContent && <TableOfContents html={htmlContent} />}
      </div>
    </div>
  );
}
