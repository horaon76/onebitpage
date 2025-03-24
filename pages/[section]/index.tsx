import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import { getSections, getFilesInSection, getMarkdownContent, getNestedFiles } from "@/lib/getContent";
import matter from "gray-matter";

type Props = {
  section: string;
  files: { slug: string; title: string; date: string; category: string }[];
};

export default function SectionPage({ section, files }: Props) {
  console.log("hello 2")
  return (
    <div>
      <h1>{section}</h1>
      <ul>
        {files.map((file) => (
          <li key={file.slug}>
            <Link href={`/${section}/${file.slug}`}>
              <strong>{file.title}</strong> - {file.date} ({file.category})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// **Pre-generate paths for all sections**
export const getStaticPaths: GetStaticPaths = async () => {
  const sections = getSections();
  const paths = sections.map((section) => ({ params: { section } }));
  return { paths, fallback: false };
};

// **Pre-generate props (sorted by date descending)**
export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("hello 1")
  const section = params?.section as string;
  const files = getFilesInSection(section)
    .map(({ slug }) => {
      const markdown = getMarkdownContent(slug, section);
      const { data } = matter(markdown);
      return { slug, title: data.title, date: data.date, category: data.category };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date desc

    const menu = getNestedFiles(); // Ensure this runs on the server
    return { props: { section, files, menu } }; // 🔥 Will refresh every second in dev mode
};
