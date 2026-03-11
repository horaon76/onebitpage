import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import {
  getAllPatternPaths,
  getCategoryBySlug,
  getPatternBySlug,
  CONTENT_FILE_MAP,
  CategoryInfo,
  PatternInfo,
} from "@/lib/lldContent";
import { markdownToHtml } from "@/lib/markdownToHtml";
import TutorialLayout from "@/components/TutorialLayout";
import PatternPageComponent from "@/components/PatternPage";
import { getPatternData, hasPatternData } from "@/lib/patterns";
import { PatternData } from "@/lib/patterns/types";

interface Props {
  category: CategoryInfo;
  pattern: PatternInfo;
  htmlContent: string;
  patternData: PatternData | null;
  patternTocHtml: string;
}

/**
 * Generate synthetic HTML with h2/h3 headings so the TutorialLayout TOC can parse them.
 */
function buildPatternTocHtml(data: PatternData): string {
  const headings: string[] = [];

  // Overview sections
  headings.push('<h2 id="intent">Intent</h2>');
  headings.push('<h2 id="class-diagram">Class Diagram</h2>');
  if (data.diagramExplanation) {
    headings.push('<h3 id="explanation">Explanation</h3>');
  }
  if (data.diagramComponents && data.diagramComponents.length > 0) {
    headings.push('<h3 id="diagram-components">Diagram Components</h3>');
  }
  if (data.solutionDetail) {
    headings.push('<h2 id="solution">Solution</h2>');
  }
  headings.push('<h2 id="key-characteristics">Key Characteristics</h2>');

  // Use Cases
  if (data.useCases && data.useCases.length > 0) {
    headings.push('<h2 id="use-cases">Use Cases</h2>');
  }

  // Examples
  headings.push('<h2 id="examples">Examples</h2>');
  data.examples.forEach((ex) => {
    const id = `example-${ex.id}`;
    headings.push(`<h3 id="${id}">${ex.domain}</h3>`);
  });

  // Variants / Implementation Approaches
  if (data.variants && data.variants.length > 0) {
    const label = data.variantsTabLabel || "Variants";
    headings.push(`<h2 id="variants">${label}</h2>`);
    data.variants.forEach((v) => {
      const id = `variant-${v.id}`;
      headings.push(`<h3 id="${id}">${v.name}</h3>`);
    });
  }

  // Summary
  headings.push('<h2 id="pattern-summary">Summary</h2>');
  if (data.antiPatterns && data.antiPatterns.length > 0) {
    headings.push('<h3 id="anti-patterns">Anti-Patterns</h3>');
  }

  return headings.join("\n");
}

export default function PatternPage({ category, pattern, htmlContent, patternData, patternTocHtml }: Props) {
  // If interactive pattern data is available, use the new PatternPage component
  if (patternData) {
    return (
      <TutorialLayout htmlContent={patternTocHtml}>
        <PatternPageComponent data={patternData} />
      </TutorialLayout>
    );
  }

  // Fallback: render markdown content as before
  return (
    <TutorialLayout htmlContent={htmlContent}>
      <div className="onepagebit" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </TutorialLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPatternPaths().map(({ category, pattern }) => ({
    params: { category, pattern },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categorySlug = params?.category as string;
  const patternSlug = params?.pattern as string;

  const category = getCategoryBySlug(categorySlug);
  const pattern = getPatternBySlug(categorySlug, patternSlug);

  if (!category || !pattern) return { notFound: true };

  // Check for interactive pattern data first
  let patternData: PatternData | null = null;
  if (hasPatternData(categorySlug, patternSlug)) {
    patternData = getPatternData(categorySlug, patternSlug) ?? null;
  }

  const contentFileKey = `${categorySlug}/${patternSlug}`;
  const contentRelPath = CONTENT_FILE_MAP[contentFileKey];

  let htmlContent = "<p>Content coming soon...</p>";

  if (contentRelPath) {
    const filePath = path.join(process.cwd(), contentRelPath);
    if (fs.existsSync(filePath)) {
      const rawContent = fs.readFileSync(filePath, "utf-8");
      // Strip frontmatter if present
      const contentWithoutFrontmatter = rawContent.replace(/^---[\s\S]*?---\n*/, "");
      htmlContent = markdownToHtml(contentWithoutFrontmatter);
    }
  }

  const patternTocHtml = patternData ? buildPatternTocHtml(patternData) : "";

  return {
    props: {
      category,
      pattern,
      htmlContent,
      patternData,
      patternTocHtml,
    },
  };
};
