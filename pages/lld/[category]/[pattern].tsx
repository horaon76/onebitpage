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

interface Props {
  category: CategoryInfo;
  pattern: PatternInfo;
  htmlContent: string;
}

export default function PatternPage({ category, pattern, htmlContent }: Props) {
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

  return {
    props: {
      category,
      pattern,
      htmlContent,
    },
  };
};
