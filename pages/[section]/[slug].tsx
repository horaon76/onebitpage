import { GetStaticProps, GetStaticPaths } from "next";
import { getMarkdownContent, getSections, getFilesInSection, getNestedFiles } from "@/lib/getContent";
import { markdownToHtml } from "@/lib/markdownToHtml";
import matter from "gray-matter";
import { useEffect } from "react";
import MarkdownIt from "markdown-it";
import SectionParser from '@/components/SectionJumper';

type Props = {
  content: string;
  meta: { title: string; date: string; category: string };
};

export default function BlogPost({ content, meta }: Props) {
  // Initialize MarkdownIt parser
  const md = new MarkdownIt();

  // Load the Giscus script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.setAttribute('data-repo', '/');
    script.setAttribute('data-repo-id', '');
    script.setAttribute('data-category', '');
    script.setAttribute('data-category-id', '');
    script.setAttribute('data-mapping', 'url');
    if (typeof window !== "undefined") {
      script.setAttribute('data-term', window.location.href); // Unique term based on the post URL
    }
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('crossorigin', 'anonymous');
    document.body.appendChild(script);
  });
    // Generate the section jumper (table of contents)
  
  return (
    <div className="onepagebit">
      <h1>{meta.title}</h1>
      <div className="blog-meta">
        <span>📅 {meta.date}</span>
        <span>📂 {meta.category}</span>
      </div>
      <hr />
      
      {/* Section Jumper - Table of Contents */}
      <div className="section-jumper-container">
        <SectionParser content={content} />
      </div>

      {/* Blog Content */}
      <div dangerouslySetInnerHTML={{ __html: content }} />

      {/* Giscus comment section */}
      <div id="giscus" className="giscus"/>
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
