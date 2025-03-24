import { GetStaticProps, GetStaticPaths } from "next";
import { getMarkdownContent, getSections, getFilesInSection, getNestedFiles } from "@/lib/getContent";
import { markdownToHtml } from "@/lib/markdownToHtml";
import matter from "gray-matter";
import { useEffect } from "react";
import MarkdownIt from "markdown-it";
import SectionParser from '@/components/SectionJumper';
import path from 'path';
import getFileStructure from '@/lib/getContent'; // Import the helper function

type Props = {
  content: string;
  meta: { title: string; date: string; category: string };
  fileStructure: { [key: string]: string[] }; // Added fileStructure prop
};

export default function BlogPost({ content, meta, fileStructure }: Props) {
  const md = new MarkdownIt();

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

  // Function to render the file structure as a sidebar
  const renderMenu = (structure: { [key: string]: string[] }={}) => {
    return Object.keys(structure).map((folder) => (
      <div key={folder} className="menu-section">
        <h3>{folder}</h3>
        <ul>
          {structure[folder].map((file) => (
            <li key={file}>
              <a href={`/category/${folder}/${file}`}>{file}</a>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="onepagebit">
      <h1>{meta?.title}</h1>
      <div className="blog-meta">
        <span>📅 {meta?.date}</span>
        <span>📂 {meta?.category}</span>
      </div>
      <hr />

      <div className="content-layout">
        {/* Left Sidebar for the Menu */}
        <div className="left-sidebar">
          {renderMenu(fileStructure)}  {/* Render the file structure as menu */}
        </div>

        {/* Main Content Section */}
        <div className="main-content">
          {/* Section Jumper - Table of Contents */}
          <div className="section-jumper-container">
            <SectionParser content={content} />
          </div>

          {/* Blog Content */}
          <div dangerouslySetInnerHTML={{ __html: content }} />

          {/* Giscus comment section */}
          <div id="giscus" className="giscus" />
        </div>
      </div>
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("getStaticProps is being executed!");

  // Remove these conditions for testing purposes:
  if (!params?.section || !params?.slug) return { notFound: true };

  const contentPath = path.join(process.cwd(), 'content', 'category', params.section as string);

  const markdownContent = getMarkdownContent(
    params.slug as string,
    params.section as string
  );
  const { content, data } = matter(markdownContent); // Extract front matter
  
  const meta = {
    title: data?.title || 'Default Title',
    date: data?.date || 'Unknown Date',
    category: data?.category || 'Uncategorized'
  };

  const htmlContent = markdownToHtml(content);

  const fileStructure = getFileStructure(contentPath);
  console.log('File Structure:', fileStructure);

  const menu = getNestedFiles();

  return { props: { content: htmlContent, meta, menu, fileStructure } };
};


