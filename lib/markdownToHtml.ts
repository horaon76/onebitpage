import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true, // Allow HTML in Markdown
  linkify: true, // Auto-link URLs
  typographer: true, // Smart quotes, dashes, etc.
});

export function markdownToHtml(markdown: string): string {
  return md.render(markdown);
}
