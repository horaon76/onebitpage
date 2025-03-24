import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const getMarkdownContent = (slug?: string, section?: string): string => {
  if (!slug || !section) return "";
  const filePath = path.join(CONTENT_DIR, section, `${slug}.md`);
  try {
    return fs.readFileSync(filePath.toLowerCase(), "utf-8");
  } catch (error) {
    console.error("Error reading Markdown file:", error);
    return "";
  }
};

export const getSections = (): string[] => {
  return fs.readdirSync(CONTENT_DIR).filter((dir) =>
    fs.statSync(path.join(CONTENT_DIR, dir)).isDirectory()
  );
};

export const getFilesInSection = (section: string): { slug: string; title: string }[] => {
  const sectionPath = path.join(CONTENT_DIR, section);
  return fs.readdirSync(sectionPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(".md", ""),
      title: file.replace(".md", "").replace(/-/g, " "),
    }));
};

// Recursive function to get nested content structure

// Define a proper recursive type
type MenuItem = { slug: string; title: string };
interface MenuStructure {
  [key: string]: MenuItem[] | MenuStructure;
}

export const getNestedFiles = (dir: string = CONTENT_DIR): MenuStructure => {
  const result: MenuStructure = {};

  if (!fs.existsSync(dir)) return result; // Safety check

  fs.readdirSync(dir).forEach((item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      result[item] = getNestedFiles(fullPath); // Recursively fetch subdirectories
    } else if (item.endsWith(".md")) {
      const slug = item.replace(".md", "");
      const fileData: MenuItem = { slug, title: slug.replace(/-/g, " ") };

      if (!Array.isArray(result["files"])) {
        result["files"] = [];
      }
      (result["files"] as MenuItem[]).push(fileData);
    }
  });

  return result;
};


// Helper function to get file structure recursively
const getFileStructure = (basePath: string) => {
  const structure: { [key: string]: string[] } = {};

  // Ensure the basePath exists before proceeding
  if (!fs.existsSync(basePath)) {
    return structure; // Return an empty structure if the basePath doesn't exist
  }

  // Read directories in the base path (e.g., topics or category folders)
  const directories = fs.readdirSync(basePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory()) // Only directories
    .map((dirent) => dirent.name);

  // Loop through each directory (section) and get files (subsections)
  directories.forEach((directory) => {
    const dirPath = path.join(basePath, directory);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath, { withFileTypes: true })
        .filter((file) => file.isFile() && file.name.endsWith('.md')) // Only markdown files
        .map((file) => file.name);

      // Only add directories with markdown files
      if (files.length > 0) {
        structure[directory] = files;
      }
    }
  });
  console.log("Markdown front matter:", structure);
  return structure;
};

export default getFileStructure;

