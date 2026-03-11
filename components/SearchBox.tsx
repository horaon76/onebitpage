import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

interface SearchEntry {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  type: "pattern" | "hld" | "tech";
}

const TYPE_LABEL: Record<SearchEntry["type"], string> = {
  pattern: "LLD",
  hld: "System Design",
  tech: "Tech",
};

const TYPE_CLASS: Record<SearchEntry["type"], string> = {
  pattern: "sb-badge--lld",
  hld: "sb-badge--hld",
  tech: "sb-badge--tech",
};

let fuseInstance: Fuse<SearchEntry> | null = null;
let indexLoaded = false;

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Load index once
  useEffect(() => {
    if (indexLoaded) return;
    setLoading(true);
    fetch("/onebitpage/search-index.json")
      .then((r) => r.json())
      .then((data: SearchEntry[]) => {
        fuseInstance = new Fuse(data, {
          keys: [
            { name: "title", weight: 3 },
            { name: "category", weight: 2 },
            { name: "description", weight: 1 },
          ],
          threshold: 0.35,
          includeScore: true,
        });
        indexLoaded = true;
      })
      .catch(() => {
        // silent — search will just not work
      })
      .finally(() => setLoading(false));
  }, []);

  // Search on query change
  useEffect(() => {
    if (!fuseInstance || query.trim().length < 2) {
      setResults([]);
      setOpen(query.trim().length >= 2);
      return;
    }
    const hits = fuseInstance.search(query.trim(), { limit: 8 });
    setResults(hits.map((h) => h.item));
    setOpen(true);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Global keyboard shortcut: "/" or Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") ||
        (e.key === "k" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = useCallback(() => {
    setQuery("");
    setOpen(false);
  }, []);

  const showDropdown = open && query.trim().length >= 2;
  const noResults = showDropdown && results.length === 0 && !loading;

  return (
    <div className="site-header__search" ref={wrapRef}>
      <div className="sb-wrap">
        <svg className="sb-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        <input
          ref={inputRef}
          className="sb-input"
          type="search"
          placeholder="Search patterns, topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true);
          }}
          aria-label="Search site"
          autoComplete="off"
          spellCheck={false}
        />

        {query.length === 0 && (
          <kbd className="sb-hint">
            <span>/</span>
          </kbd>
        )}

        {query.length > 0 && (
          <button
            className="sb-clear"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="sb-dropdown" role="listbox">
          {results.length > 0 ? (
            <>
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="sb-result"
                  role="option"
                  onClick={handleSelect}
                >
                  <span className={`sb-badge ${TYPE_CLASS[item.type]}`}>
                    {TYPE_LABEL[item.type]}
                  </span>
                  <span className="sb-result__body">
                    <span className="sb-result__title">{item.title}</span>
                    <span className="sb-result__cat">{item.category}</span>
                  </span>
                </Link>
              ))}
            </>
          ) : noResults ? (
            <div className="sb-empty">
              <span className="sb-empty__msg">
                No results for <strong>&ldquo;{query}&rdquo;</strong>
              </span>
              <span className="sb-empty__hint">
                Try &nbsp;<em>singleton</em>, &nbsp;<em>kafka</em>, or &nbsp;<em>caching</em>
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
