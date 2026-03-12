import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import hljs from "highlight.js";
import {
  PatternData,
  PatternExample,
  PatternVariant,
  UseCase,
  AntiPattern,
  DiagramComponent,
  ClassDiagram,
  CodeFile,
  LANGUAGES,
  LANG_COLORS,
  LANG_ICONS,
  Language,
  SummaryRowItem,
  PatternReference,
} from "@/lib/patterns/types";

/** Normalize a legacy SVG string or a ClassDiagram object to a ClassDiagram. */
function normalizeDiagram(d: string | ClassDiagram): ClassDiagram {
  if (typeof d === "string") return { type: "svg", content: d };
  return d;
}

/** Map display-name → hljs language id */
const LANG_HLJS: Record<Language, string> = {
  Python: "python",
  Go: "go",
  Java: "java",
  TypeScript: "typescript",
  Rust: "rust",
};

// ─── Mermaid diagram renderer (client-side only) ─────────────────
function MermaidDiagram({ content, className }: { content: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (cancelled || !ref.current) return;
      const mermaid = (await import("mermaid")).default;
      const isDark = document.documentElement.dataset.theme === "dark";

      // Match the site's SVG class diagram visual theme (pattern-page.css)
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          ...(isDark
            ? {
                background: "#0c1222",       // --bg-inset dark
                primaryColor: "#1e293b",     // --card-bg dark
                primaryBorderColor: "#334155", // --border-primary dark
                primaryTextColor: "#94a3b8", // --text-secondary dark
                secondaryColor: "#1e293b",
                tertiaryColor: "#0f172a",
                lineColor: "#64748b",        // --text-tertiary dark
                textColor: "#94a3b8",
                edgeLabelBackground: "#0c1222",
                clusterBkg: "#1e293b",
                titleColor: "#94a3b8",
              }
            : {
                background: "#f0f2f5",       // --bg-inset light
                primaryColor: "#ffffff",     // --card-bg light
                primaryBorderColor: "#e2e8f0", // --border-primary light
                primaryTextColor: "#475569", // --text-secondary light
                secondaryColor: "#f8fafc",
                tertiaryColor: "#f1f5f9",
                lineColor: "#94a3b8",        // --text-tertiary light
                textColor: "#475569",
                edgeLabelBackground: "#f0f2f5",
                clusterBkg: "#f8fafc",
                titleColor: "#475569",
              }),
        },
      });

      // Fresh id each render to avoid mermaid element-id conflicts
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      const { svg } = await mermaid.render(id, content);
      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
      }
    }

    renderDiagram();

    // Re-render whenever the site switches between light and dark mode
    const observer = new MutationObserver(() => renderDiagram());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [content]);

  return <div ref={ref} className={className} />;
}

// ─── Diagram with zoom/pan controls ───────────────────────────
function DiagramViewer({ diagram }: { diagram: string | ClassDiagram }) {
  const resolved = normalizeDiagram(diagram);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.25, 3)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.25, 0.5)), []);
  const resetView = useCallback(() => { setScale(1); setTranslate({ x: 0, y: 0 }); }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((f) => !f);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // ESC to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.min(Math.max(s + (e.deltaY > 0 ? -0.1 : 0.1), 0.5), 3));
  }, []);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  }, [translate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslate({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  return (
    <div className={`pp-diagram-wrapper ${isFullscreen ? "pp-diagram-wrapper--fullscreen" : ""}`} ref={containerRef}>
      <div className="pp-diagram-viewport"
        ref={viewportRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {resolved.type === "mermaid"
          ? <div style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}>
              <MermaidDiagram content={resolved.content} className="pp-diagram-svg" />
            </div>
          : <div
              className="pp-diagram-svg"
              style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}
              dangerouslySetInnerHTML={{ __html: resolved.content }}
            />
        }
      </div>
      <div className="pp-diagram-toolbar">
        <button onClick={zoomOut} className="pp-diagram-btn" title="Zoom Out">−</button>
        <span className="pp-diagram-zoom-label">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} className="pp-diagram-btn" title="Zoom In">+</button>
        <button onClick={resetView} className="pp-diagram-btn" title="Reset">↻</button>
        <button onClick={toggleFullscreen} className="pp-diagram-btn" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          {isFullscreen ? "✕" : "⛶"}
        </button>
      </div>
    </div>
  );
}

// ─── Code Block with Copy + Syntax Highlighting ─────────────────
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language, ignoreIllegals: true }).value;
      } catch { /* fall through */ }
    }
    return null;
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="pp-codeblock">
      <button
        onClick={handleCopy}
        className={`pp-codeblock__copy ${copied ? "pp-codeblock__copy--copied" : ""}`}
      >
        {copied ? "✓ copied" : "copy"}
      </button>
      <pre className="pp-codeblock__pre hljs">
        {highlighted
          ? <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
          : <code>{code}</code>
        }
      </pre>
    </div>
  );
}

// ─── Language Tabs ───────────────────────────────────────────────
function LanguageTabs({ code }: { code: Record<Language, string> }) {
  const [active, setActive] = useState<Language>("Python");

  return (
    <div className="pp-langtabs">
      <div className="pp-langtabs__bar">
        {LANGUAGES.map((lang) => {
          const isActive = active === lang;
          return (
            <button
              key={lang}
              onClick={() => setActive(lang)}
              className={`pp-langtabs__btn ${isActive ? "pp-langtabs__btn--active" : ""}`}
              style={isActive ? {
                borderTopColor: LANG_COLORS[lang],
                borderLeftColor: LANG_COLORS[lang],
                borderRightColor: LANG_COLORS[lang],
                color: LANG_COLORS[lang],
              } : undefined}
            >
              <span className="pp-langtabs__icon" dangerouslySetInnerHTML={{ __html: LANG_ICONS[lang] }} />
              {lang}
            </button>
          );
        })}
      </div>
      <CodeBlock code={code[active]} language={LANG_HLJS[active]} />
    </div>
  );
}

// ─── Example Detail (sub-tabs per example) ──────────────────────
function ExampleDetail({ ex }: { ex: PatternExample }) {
  return (
    <div>
      <h2 className="pp-example__title">{ex.title}</h2>

      {/* Problem / Solution */}
      <div className="pp-example__grid">
        <div className="pp-card pp-card--problem">
          <div className="pp-card__label pp-card__label--red">Problem</div>
          <p className="pp-card__text">{ex.problem}</p>
        </div>
        <div className="pp-card pp-card--solution">
          <div className="pp-card__label pp-card__label--green">Solution</div>
          <p className="pp-card__text">{ex.solution}</p>
        </div>
      </div>

      {/* Class Diagram — simple static view, no zoom controls */}
      <div className="pp-section">
        <h3 className="pp-h3">Class Diagram</h3>
        {(() => {
          const d = normalizeDiagram(ex.classDiagramSvg);
          return d.type === "mermaid"
            ? <MermaidDiagram content={d.content} className="pp-diagram-static" />
            : <div className="pp-diagram-static" dangerouslySetInnerHTML={{ __html: d.content }} />;
        })()}
      </div>

      {/* Code */}
      <div className="pp-section">
        <h3 className="pp-h3">Implementation</h3>
        {ex.codeFiles
          ? <FileExplorerWithTabs codeFiles={ex.codeFiles} />
          : <LanguageTabs code={ex.code} />}
      </div>

      {/* Considerations */}
      {ex.considerations.length > 0 && (
        <div className="pp-section">
          <h3 className="pp-h3">Considerations</h3>
          <ul className="pp-simple-list">
            {ex.considerations.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── File Explorer (sidebar + content pane) ─────────────────────────
/** Group an array of CodeFile objects by their `dir` field. */
function groupByDir(files: CodeFile[]): Map<string, CodeFile[]> {
  const map = new Map<string, CodeFile[]>();
  for (const f of files) {
    const dir = f.dir ?? "/";
    if (!map.has(dir)) map.set(dir, []);
    map.get(dir)!.push(f);
  }
  return map;
}

function FileExplorer({ files, language }: { files: CodeFile[]; language: Language }) {
  const [selected, setSelected] = useState<CodeFile>(files[0]);
  const grouped = useMemo(() => groupByDir(files), [files]);

  // Keep selected file in sync when language tab changes
  useEffect(() => { setSelected(files[0]); }, [files]);

  return (
    <div className="pp-fileexplorer">
      {/* Left: file tree */}
      <div className="pp-fileexplorer__tree">
        <div className="pp-fileexplorer__tree-label">Files</div>
        {Array.from(grouped.entries()).map(([dir, dirFiles]) => (
          <div key={dir} className="pp-fileexplorer__folder">
            {dir !== "/" && (
              <div className="pp-fileexplorer__folder-name">
                <span className="pp-fileexplorer__folder-icon">▸</span>
                {dir}
              </div>
            )}
            {dirFiles.map((f) => (
              <button
                key={f.name}
                onClick={() => setSelected(f)}
                className={`pp-fileexplorer__file ${selected?.name === f.name ? "pp-fileexplorer__file--active" : ""}`}
              >
                <span className="pp-fileexplorer__file-icon">📄</span>
                {f.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Right: file content */}
      <div className="pp-fileexplorer__content">
        {selected && (
          <>
            <div className="pp-fileexplorer__filepath">
              {selected.dir && selected.dir !== "/" ? `${selected.dir}${selected.name}` : selected.name}
            </div>
            <CodeBlock code={selected.content} language={LANG_HLJS[language]} />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Language Tabs wrapping FileExplorer ───────────────────────────
function FileExplorerWithTabs({ codeFiles }: { codeFiles: NonNullable<PatternVariant["codeFiles"]> }) {
  const [active, setActive] = useState<Language>("Python");

  return (
    <div className="pp-langtabs">
      <div className="pp-langtabs__bar">
        {LANGUAGES.map((lang) => {
          const isActive = active === lang;
          return (
            <button
              key={lang}
              onClick={() => setActive(lang)}
              className={`pp-langtabs__btn ${isActive ? "pp-langtabs__btn--active" : ""}`}
              style={isActive ? {
                borderTopColor: LANG_COLORS[lang],
                borderLeftColor: LANG_COLORS[lang],
                borderRightColor: LANG_COLORS[lang],
                color: LANG_COLORS[lang],
              } : undefined}
            >
              <span className="pp-langtabs__icon" dangerouslySetInnerHTML={{ __html: LANG_ICONS[lang] }} />
              {lang}
            </button>
          );
        })}
      </div>
      <FileExplorer files={codeFiles[active]} language={active} />
    </div>
  );
}

// ─── Variant Detail ───────────────────────────────────────────────
function VariantDetail({ variant }: { variant: PatternVariant }) {
  return (
    <div>
      <h2 className="pp-variant__title">{variant.name}</h2>
      <p className="pp-variant__desc">{variant.description}</p>

      {/* Multi-file explorer when codeFiles is present; fallback to LanguageTabs */}
      {variant.codeFiles
        ? <FileExplorerWithTabs codeFiles={variant.codeFiles} />
        : <LanguageTabs code={variant.code} />
      }

      {/* Optional per-variant class diagram */}
      {variant.classDiagramSvg && (
        <div className="pp-section">
          <h3 className="pp-h3">Structure Diagram</h3>
          {variant.diagramExplanation && (
            <p className="pp-para pp-para--spaced" style={{ marginBottom: 12 }}>
              {variant.diagramExplanation}
            </p>
          )}
          {(() => {
            const d = normalizeDiagram(variant.classDiagramSvg);
            return d.type === "mermaid"
              ? <MermaidDiagram content={d.content} className="pp-diagram-static" />
              : <div className="pp-diagram-static" dangerouslySetInnerHTML={{ __html: d.content }} />;
          })()}
        </div>
      )}

      <div className="pp-variant__proscons">
        <div className="pp-card pp-card--pros">
          <div className="pp-card__label pp-card__label--green">Pros</div>
          <ul className="pp-proscons-list">
            {variant.pros.map((p, i) => (
              <li key={i}><span className="pp-proscons-icon pp-proscons-icon--pro">✓</span>{p}</li>
            ))}
          </ul>
        </div>
        <div className="pp-card pp-card--cons">
          <div className="pp-card__label pp-card__label--red">Cons</div>
          <ul className="pp-proscons-list">
            {variant.cons.map((c, i) => (
              <li key={i}><span className="pp-proscons-icon pp-proscons-icon--con">✗</span>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Comparison Table for Variants ──────────────────────────────
function VariantsComparison({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="pp-comparison">
      <h3 className="pp-h3">Comparison</h3>
      <div className="pp-comparison__table-wrap">
        <table className="pp-comparison__table">
          <thead>
            <tr>
              {headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main PatternPage Component ─────────────────────────────────
interface PatternPageProps {
  data: PatternData;
}

export default function PatternPage({ data }: PatternPageProps) {
  // Build list of tabs dynamically
  const tabs: string[] = ["Overview", "Use Cases", "Examples"];
  const variantsLabel = data.variantsTabLabel || "Implementation Approaches";
  if (data.variants && data.variants.length > 0) {
    tabs.push(variantsLabel);
  }
  tabs.push("Summary");
  if (data.references && data.references.length > 0) {
    tabs.push("References");
  }

  const [topTab, setTopTab] = useState(tabs[0]);
  const [openExample, setOpenExample] = useState(1);
  const [openVariant, setOpenVariant] = useState(1);

  return (
    <div className="pp-root">
      {/* Header */}
      <div className="pp-header">
        <div className="pp-header__badge">{data.categoryLabel}</div>
        <h1 className="pp-header__title">{data.title}</h1>
        <p className="pp-header__subtitle">{data.subtitle}</p>

        {/* Tabs */}
        <div className="pp-header__tabs">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTopTab(t)}
              className={`pp-header__tab ${topTab === t ? "pp-header__tab--active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="pp-body">
        {/* ── OVERVIEW ── */}
        {topTab === "Overview" && (
          <div>
            <section className="pp-section" id="intent">
              <h2 className="pp-h2">Intent</h2>
              <p className="pp-para">{data.intent}</p>
            </section>

            <section className="pp-section" id="class-diagram">
              <h2 className="pp-h2">Class Diagram</h2>
              <DiagramViewer diagram={data.classDiagramSvg} />
            </section>

            {/* Explanation — what's happening in the class diagram */}
            <section className="pp-section" id="explanation">
              <h2 className="pp-h2">Explanation</h2>
              <p className="pp-para">{data.diagramExplanation}</p>
            </section>

            {/* Diagram Components — simple list explaining each piece */}
            <section className="pp-section" id="diagram-components">
              <h2 className="pp-h2">Diagram Components</h2>
              <ul className="pp-component-list">
                {data.diagramComponents.map((comp, i) => (
                  <li key={i} className="pp-component-list__item">
                    <span className="pp-component-list__name">{comp.name}</span>
                    <span className="pp-component-list__desc">{comp.description}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Solution — detailed how the pattern solves the problem */}
            <section className="pp-section" id="solution">
              <h2 className="pp-h2">Solution</h2>
              <div className="pp-solution-detail">
                {data.solutionDetail.split("\n\n").map((paragraph, i) => {
                  // Handle bold markdown (**text**)
                  const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <p key={i} className="pp-para pp-para--spaced">
                      {parts.map((part, j) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            </section>

            <section className="pp-section" id="key-characteristics">
              <h2 className="pp-h2">Key Characteristics</h2>
              <ul className="pp-simple-list">
                {data.characteristics.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* ── USE CASES ── */}
        {topTab === "Use Cases" && (
          <div>
            <h2 className="pp-h2" id="use-cases">Use Cases</h2>
            <p className="pp-para pp-para--spaced">
              Common real-world scenarios where the {data.title.replace(" Pattern", "")} pattern is the right choice.
            </p>
            <div className="pp-usecases">
              {data.useCases.map((uc) => (
                <div key={uc.id} className="pp-usecase">
                  <div className="pp-usecase__header">
                    <span className="pp-usecase__num">{String(uc.id).padStart(2, "0")}</span>
                    <div>
                      <div className="pp-usecase__title">{uc.title}</div>
                      <div className="pp-usecase__domain">{uc.domain}</div>
                    </div>
                  </div>
                  <p className="pp-usecase__desc">{uc.description}</p>
                  <div className="pp-usecase__why">
                    <span className="pp-usecase__why-label">Why {data.title.replace(" Pattern", "")}?</span>
                    {uc.whySingleton}
                  </div>
                  {uc.code && (
                    <pre className="pp-usecase__code"><code>{uc.code}</code></pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXAMPLES ── */}
        {topTab === "Examples" && (
          <div className="pp-examples-layout">
            <div className="pp-examples-sidebar">
              <div className="pp-examples-sidebar__label">Examples</div>
              {data.examples.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setOpenExample(ex.id)}
                  className={`pp-examples-sidebar__btn ${openExample === ex.id ? "pp-examples-sidebar__btn--active" : ""}`}
                >
                  <span className="pp-examples-sidebar__num">
                    {String(ex.id).padStart(2, "0")}
                  </span>
                  {ex.domain}
                </button>
              ))}
            </div>
            <div className="pp-examples-detail">
              {data.examples
                .filter((e) => e.id === openExample)
                .map((ex) => (
                  <ExampleDetail key={ex.id} ex={ex} />
                ))}
            </div>
          </div>
        )}

        {/* ── VARIANTS / IMPLEMENTATION APPROACHES ── */}
        {topTab === variantsLabel && data.variants && (
          <div>
            <div className="pp-examples-layout">
              <div className="pp-examples-sidebar">
                <div className="pp-examples-sidebar__label">{variantsLabel}</div>
                {data.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setOpenVariant(v.id)}
                    className={`pp-examples-sidebar__btn ${openVariant === v.id ? "pp-examples-sidebar__btn--active" : ""}`}
                  >
                    <span className="pp-examples-sidebar__num">
                      {String(v.id).padStart(2, "0")}
                    </span>
                    {v.name}
                  </button>
                ))}
              </div>
              <div className="pp-examples-detail">
                {data.variants
                  .filter((v) => v.id === openVariant)
                  .map((v) => (
                    <VariantDetail key={v.id} variant={v} />
                  ))}
              </div>
            </div>

            {/* Comparison table */}
            {data.comparisonHeaders && data.comparisonRows && (
              <VariantsComparison headers={data.comparisonHeaders} rows={data.comparisonRows} />
            )}

            {/* Best pick recommendation */}
            {data.variantsBestPick && (
              <div className="pp-bestpick">
                <div className="pp-bestpick__label">Recommendation</div>
                <p className="pp-bestpick__text">{data.variantsBestPick}</p>
              </div>
            )}
          </div>
        )}

        {/* ── SUMMARY ── */}
        {topTab === "Summary" && (
          <div>
            <h2 className="pp-h2" id="pattern-summary">Pattern Summary</h2>
            <div className="pp-summary">
              {data.summary.map((row) => (
                <div key={row.aspect} className="pp-summary__row">
                  <div className="pp-summary__aspect">{row.aspect}</div>
                  <div className="pp-summary__detail">
                    {row.detail}
                    {row.items && row.items.length > 0 && (
                      <ul className="pp-summary__items">
                        {row.items.map((item: SummaryRowItem) => (
                          <li key={item.title} className="pp-summary__item">
                            <span className="pp-summary__item-title">{item.title}</span>
                            <span className="pp-summary__item-desc">{item.description}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {row.code && (
                      <pre className="pp-usecase__code pp-summary__code">{row.code}</pre>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Anti-Patterns */}
            {data.antiPatterns && data.antiPatterns.length > 0 && (
              <section className="pp-section" id="anti-patterns" style={{ marginTop: 36 }}>
                <h2 className="pp-h2">Anti-Patterns</h2>
                <p className="pp-para pp-para--spaced">Common misuses and pitfalls to avoid.</p>
                <div className="pp-antipatterns">
                  {data.antiPatterns.map((ap, i) => (
                    <div key={i} className="pp-antipattern">
                      <div className="pp-antipattern__name">
                        <span className="pp-antipattern__icon">⚠</span>
                        {ap.name}
                      </div>
                      <p className="pp-antipattern__desc">{ap.description}</p>
                      <div className="pp-antipattern__alt">
                        <span className="pp-antipattern__alt-label">Better Alternative →</span>
                        {ap.betterAlternative}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── REFERENCES ── */}
        {topTab === "References" && (
          <div>
            <h2 className="pp-h2">References &amp; Further Reading</h2>
            <p className="pp-para pp-para--spaced" style={{ marginBottom: 24 }}>
              Authoritative sources and recommended reading for learners who want to go deeper.
            </p>
            <div className="pp-references">
              {(data.references ?? []).map((ref: PatternReference, i: number) => (
                <div key={i} className="pp-reference">
                  <div className="pp-reference__header">
                    <span className="pp-reference__type">{ref.type}</span>
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pp-reference__title pp-reference__title--link"
                      >
                        {ref.title}
                      </a>
                    ) : (
                      <span className="pp-reference__title">{ref.title}</span>
                    )}
                  </div>
                  {(ref.author || ref.year) && (
                    <div className="pp-reference__meta">
                      {[ref.author, ref.year].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  <p className="pp-reference__desc">{ref.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
