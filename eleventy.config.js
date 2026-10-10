
export default function (eleventyConfig) {
  // Static assets copied as-is: headshot, OG image, PDF, favicon, fonts.
  eleventyConfig.addPassthroughCopy({ public: "/" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/bricolage-grotesque/opsz.css": "assets/fonts/bricolage.css",
    "node_modules/@fontsource-variable/bricolage-grotesque/files": "assets/fonts/files",
  });
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addCollection("workSorted", (api) =>
    api.getFilteredByTag("work").sort((a, b) => a.data.order - b.data.order)
  );
  eleventyConfig.addCollection("writingSorted", (api) =>
    api.getFilteredByTag("writing").sort((a, b) => a.data.order - b.data.order)
  );

  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter("xmlEscape", (s = "") =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  );
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
