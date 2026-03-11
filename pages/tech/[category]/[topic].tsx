import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import {
  getAllTechTopicPaths,
  getTechCategoryBySlug,
  getTechTopicBySlug,
  TECH_CONTENT_FILE_MAP,
  TechCategoryInfo,
  TechTopicInfo,
} from "@/lib/techContent";
import { markdownToHtml } from "@/lib/markdownToHtml";
import TutorialLayout from "@/components/TutorialLayout";

interface Props {
  category: TechCategoryInfo;
  topic: TechTopicInfo;
  htmlContent: string;
}

export default function TechTopicPage({ category, topic, htmlContent }: Props) {
  return (
    <TutorialLayout htmlContent={htmlContent}>
      <div className="onepagebit" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </TutorialLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllTechTopicPaths().map(({ category, topic }) => ({
    params: { category, topic },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categorySlug = params?.category as string;
  const topicSlug = params?.topic as string;

  const category = getTechCategoryBySlug(categorySlug);
  const topic = getTechTopicBySlug(categorySlug, topicSlug);

  if (!category || !topic) return { notFound: true };

  const contentFileKey = `${categorySlug}/${topicSlug}`;
  const contentRelPath = TECH_CONTENT_FILE_MAP[contentFileKey];

  let htmlContent = "<p>Content coming soon...</p>";

  if (contentRelPath) {
    const filePath = path.join(process.cwd(), contentRelPath);
    if (fs.existsSync(filePath)) {
      const rawContent = fs.readFileSync(filePath, "utf-8");
      const contentWithoutFrontmatter = rawContent.replace(/^---[\s\S]*?---\n*/, "");
      htmlContent = markdownToHtml(contentWithoutFrontmatter);
    }
  }

  return {
    props: {
      category,
      topic,
      htmlContent,
    },
  };
};
