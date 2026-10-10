import site from "./site.js";

export default JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Technical product leader",
  url: site.url,
  image: `${site.url}/headshot.jpg`,
  sameAs: [site.linkedin, site.github],
}).replace(/</g, "\\u003c");
