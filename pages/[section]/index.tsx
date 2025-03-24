import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import { getSections, getFilesInSection, getMarkdownContent, getNestedFiles } from "@/lib/getContent";
import matter from "gray-matter";

type Props = {
  section: string;
  files: { slug: string; title: string; date: string; category: string }[];
};

export default function SectionPage({ section, files }: Props) {
  return (
    <div>
      {/* <h1>{section}</h1> */}
      <ul>
        {/* {files.map((file) => (
          <li key={file.slug}>
            <Link href={`/${section}/${file.slug}`}>
              <strong>{file.title}</strong> - {file.date} ({file.category})
            </Link>
          </li>
        ))} */}
      </ul>
    </div>
  );
}
