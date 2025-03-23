import { GetStaticProps, GetStaticPaths } from "next";
import {
  getMarkdownContent,
  getSections,
  getFilesInSection,
  getNestedFiles,
} from "@/lib/getContent";
import { markdownToHtml } from "@/lib/markdownToHtml";
import matter from "gray-matter";

type Props = {
  content: string;
  meta: { title: string; date: string; category: string };
};

export default function BlogPost({ content, meta }: Props) {
  return (
    <div className="onepagebit">
      <h1>{meta.title}</h1>
      <div className="blog-meta">
        <span>📅 {meta.date}</span>
        <span>📂 {meta.category}</span>
      </div>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

// ✅ Generate static paths for all markdown files
export const getStaticPaths: GetStaticPaths = async () => {
  const sections = getSections();
  const paths: { params: { section: string; slug: string } }[] = [];

  sections.forEach((section) => {
    const files = getFilesInSection(section);
    files.forEach((file) => {
      paths.push({ params: { section, slug: file.slug } });
    });
  });

  return { paths, fallback: false };
};

// ✅ Generate static props for each blog post
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.section || !params?.slug) return { notFound: true };

  const markdownContent = getMarkdownContent(
    params.slug as string,
    params.section as string
  );
  const { content, data } = matter(markdownContent); // Extract front matter
  const htmlContent = markdownToHtml(content);
  const menu = getNestedFiles(); // Ensure this runs on the server
  return { props: { content: htmlContent, meta: data, menu } };
};
