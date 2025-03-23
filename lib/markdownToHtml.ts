import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

const md = new MarkdownIt({
  html: true, // Allow HTML in Markdown
  linkify: true, // Auto-link URLs
  typographer: true, // Smart quotes, dashes, etc.
});

export function markdownToHtml(markdown: string): string {
  // Use markdown-it-anchor to add unique IDs to headings
  md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "before"
    }),
  });
  return md.render(markdown);
}
