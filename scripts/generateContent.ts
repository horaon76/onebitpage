const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_FILE = path.join(process.cwd(), "public", "content.json");

type FileData = {
  slug: string;
  title: string;
  shortTitle: string;
  intro: string;
  tags: string[];
  date: string;
  category: string;
  order: number;
  path: string;
  breadcrumb: string[];
};

type FolderData = {
  title: string;
  order: number;
  path: string;
  breadcrumb: string[];
  children?: (FileData | FolderData)[];
};

// ✅ Extract numerical order from file/folder names (e.g., "1_Coding" → 1)
const getOrder = (name: string): number => {
  const match = name.match(/^(\d+)_/);
  return match ? parseInt(match[1], 10) : 9999; // Default to 9999 if no prefix
};

// ✅ Remove the prefix (e.g., "1_Coding" → "Coding")
const cleanName = (name: string): string => name.replace(/^\d+_/, "");

// ✅ Read Markdown frontmatter
const getFileMetadata = (filePath: string, sectionName: string, breadcrumb: string[]): FileData => {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(rawContent);
  const fileName = path.basename(filePath, ".md");
  const order = getOrder(fileName);
  const cleanFileName = cleanName(fileName);
  const filePathSlug = `${sectionName}/${cleanFileName}`;

  return {
    slug: filePathSlug,
    title: data.title || cleanFileName,
    shortTitle: data.shortTitle || data.title || cleanFileName,
    intro: data.intro || "",
    tags: data.tags || [],
    date: data.date || "",
    category: data.category || sectionName,
    order,
    path: filePathSlug,
    breadcrumb: [...breadcrumb, cleanFileName], // Breadcrumb follows hierarchy
  };
};

// ✅ Recursively scan folders and generate nested structure
const scanFolder = (dirPath: string, breadcrumb: string[] = []): (FileData | FolderData)[] => {
  if (!fs.existsSync(dirPath)) return [];

  return fs.readdirSync(dirPath)
    .sort((a, b) => getOrder(a) - getOrder(b)) // Sort by extracted order
    .map((item) => {
      const itemPath = path.join(dirPath, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();
      const cleanItemName = cleanName(item);
      const itemBreadcrumb = [...breadcrumb, cleanItemName];
      const sectionSlug = breadcrumb.length ? breadcrumb.join("/") : cleanItemName;

      if (isDirectory) {
        return {
          title: cleanItemName,
          order: getOrder(item),
          path: sectionSlug,
          breadcrumb: itemBreadcrumb,
          children: scanFolder(itemPath, itemBreadcrumb),
        };
      } else if (item.endsWith(".md")) {
        return getFileMetadata(itemPath, sectionSlug, itemBreadcrumb);
      }
    }).filter(Boolean); // Remove undefined values
};

// ✅ Generate JSON structure
const generateJSON = () => {
  const data = scanFolder(CONTENT_DIR);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Content JSON saved: ${OUTPUT_FILE}`);
};

// Run script
generateJSON();
