import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const getMarkdownContent = (slug?: string, section?: string): string => {
  if (!slug || !section) return "";
  const filePath = path.join(CONTENT_DIR, section, `${slug}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("Error reading Markdown file:", error);
    return "";
  }
};

export const getSections = (): string[] =>
  fs.readdirSync(CONTENT_DIR).filter((dir) =>
    fs.statSync(path.join(CONTENT_DIR, dir)).isDirectory()
  );

export const getFilesInSection = (
  section: string
): { slug: string; title: string }[] => {
  const sectionPath = path.join(CONTENT_DIR, section);
  return fs
    .readdirSync(sectionPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(".md", ""),
      title: file.replace(".md", "").replace(/-/g, " "),
    }));
};
