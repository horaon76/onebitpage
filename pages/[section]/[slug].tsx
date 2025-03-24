import { GetStaticProps, GetStaticPaths } from "next";
import { getSections, getFilesInSection, getMarkdownContent, getFileStructure } from "@/lib/getContent";
import { markdownToHtml } from "@/lib/markdownToHtml";
import matter from "gray-matter";
import path from "path";
import fs from "fs";
import * as Accordion from "@radix-ui/react-accordion";
import SectionParser from "@/components/SectionJumper";

type Props = {
  content: string;
  meta: { title: string; date: string; category: string };
  fileStructure: { [key: string]: any };
};

export default function BlogPost({ content, meta, fileStructure }: Props) {
  // Render folder structure with Radix UI Accordion
  const renderAccordion = (structure: { [key: string]: any } = {}) => {
    if (!structure || typeof structure !== "object") {
      console.error("Invalid structure:", structure);
      return <p>Error loading file structure</p>;
    }

    return (
      <Accordion.Root type="multiple" className="w-full">
        {Object.entries(structure).map(([folder, filesOrFolders]) => (
          <Accordion.Item key={folder} value={folder} className="border-b">
            <Accordion.Trigger className="w-full p-2 text-left bg-gray-100 hover:bg-gray-200">
              {folder}
            </Accordion.Trigger>
            <Accordion.Content className="p-2 pl-4 bg-gray-50">
              {Array.isArray(filesOrFolders) ? (
                <ul>
                  {filesOrFolders.map((file) => (
                    <li key={file}>
                      <a href={`/section/${folder}/${file}`} className="block p-1 hover:underline">
                        {file.replace(".md", "")}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                renderAccordion(filesOrFolders)
              )}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    );
  };

  return (
    <div className="onepagebit flex">
     123
    </div>
  );
}

// // ✅ Generate static paths for all markdown files
// export const getStaticPaths: GetStaticPaths = async () => {
//   const sections = getSections(); // Example: ["Database", "system-design"]
//   const paths = sections.flatMap((section) =>
//     getFilesInSection(section).map((file) => ({
//       params: {
//         section: section.toLowerCase(),  // 🔥 Convert to lowercase
//         slug: file.slug.toLowerCase(),  // 🔥 Convert to lowercase
//       },
//     }))
//   );

//   console.log("✅ Generated Paths:", paths, sections);
//   return { paths, fallback: false };
// };


// // ✅ Generate static props (runs only at build time)
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   if (!params?.section || !params?.slug) {
//     return { notFound: true };
//   }

//   const contentPath = path.join(process.cwd(), "content", "category", params.section as string, `${params.slug}.md`);
  
//   if (!fs.existsSync(contentPath)) {
//     return { notFound: true };
//   }

//   const fileContent = fs.readFileSync(contentPath, "utf-8");
//   const { content, data } = matter(fileContent);
//   const htmlContent = markdownToHtml(content);

//   const meta = {
//     title: data?.title || "Default Title",
//     date: data?.date || "Unknown Date",
//     category: data?.category || "Uncategorized",
//   };

//   const fileStructure = getFileStructure(path.join(process.cwd(), "content", "category"));

//   console.log("hello", fileStructure)
//   return { props: { content: htmlContent, meta, fileStructure } };
// };
