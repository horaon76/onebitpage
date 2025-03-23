import fs from "fs";
import path from "path";

// Define the base content directory (adjust this as needed)
const CONTENT_DIR = path.join(process.cwd(), "content");

// Function to read a Markdown file and return its content
export function getMarkdownContent(slug?: string, section?: string): string {
  if (!slug || !section) return "";

  const filePath = path.join(CONTENT_DIR, section, `${slug}.md`);

  try {
    return fs.readFileSync(filePath, "utf-8"); // Read file contents
  } catch (error) {
    console.error("Error reading Markdown file:", error);
    return ""; // Return empty string if file not found
  }
}

// Function to get all section folders inside `content/`
export function getSections(): string[] {
  return fs.readdirSync(CONTENT_DIR).filter((dir) =>
    fs.statSync(path.join(CONTENT_DIR, dir)).isDirectory()
  );
}

// Function to get Markdown files in a section
export function getFilesInSection(section: string): { slug: string; title: string }[] {
  const sectionPath = path.join(CONTENT_DIR, section);

  return fs.readdirSync(sectionPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(".md", ""),
      title: file.replace(".md", "").replace(/-/g, " "), // Convert slug to title
    }));
}
