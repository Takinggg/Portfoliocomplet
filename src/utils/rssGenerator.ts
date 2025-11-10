// RSS Feed Generator for Blog
import { BlogPost } from "../components/blog/BlogPostCard";

interface RSSConfig {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  language: string;
  author: string;
  email: string;
}

export function generateRSSFeed(posts: BlogPost[], config: RSSConfig): string {
  const {
    title,
    description,
    siteUrl,
    feedUrl,
    language,
    author,
    email,
  } = config;

  const latestPostDate =
    posts.length > 0
      ? new Date(
          Math.max(...posts.map((p) => new Date(p.publishedAt).getTime()))
        ).toUTCString()
      : new Date().toUTCString();

  const rssItems = posts
    .filter((post) => post.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map((post) => generateRSSItem(post, siteUrl))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(siteUrl)}</link>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <language>${language}</language>
    <lastBuildDate>${latestPostDate}</lastBuildDate>
    <managingEditor>${escapeXml(email)} (${escapeXml(author)})</managingEditor>
    <webMaster>${escapeXml(email)} (${escapeXml(author)})</webMaster>
    <generator>Portfolio Freelance Pro RSS Generator</generator>
    <image>
      <url>${siteUrl}/icons/icon-512x512.png</url>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(siteUrl)}</link>
    </image>
${rssItems}
  </channel>
</rss>`;
}

function generateRSSItem(post: BlogPost, siteUrl: string): string {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const pubDate = new Date(post.publishedAt).toUTCString();

  // Generate category labels
  const categoryLabels: Record<string, string> = {
    development: "Développement",
    design: "Design",
    business: "Business",
  };

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.excerpt)}</description>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(categoryLabels[post.category] || post.category)}</category>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      ${post.coverImage ? `<enclosure url="${escapeXml(post.coverImage)}" type="image/jpeg" />` : ""}
    </item>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Generate Atom feed (alternative format)
export function generateAtomFeed(posts: BlogPost[], config: RSSConfig): string {
  const {
    title,
    description,
    siteUrl,
    feedUrl,
    language,
    author,
    email,
  } = config;

  const latestPostDate =
    posts.length > 0
      ? new Date(
          Math.max(...posts.map((p) => new Date(p.publishedAt).getTime()))
        ).toISOString()
      : new Date().toISOString();

  const atomEntries = posts
    .filter((post) => post.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map((post) => generateAtomEntry(post, siteUrl))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <subtitle>${escapeXml(description)}</subtitle>
  <link href="${escapeXml(siteUrl)}" />
  <link href="${escapeXml(feedUrl)}" rel="self" type="application/atom+xml" />
  <updated>${latestPostDate}</updated>
  <id>${escapeXml(siteUrl)}</id>
  <author>
    <name>${escapeXml(author)}</name>
    <email>${escapeXml(email)}</email>
  </author>
  <generator>Portfolio Freelance Pro Atom Generator</generator>
${atomEntries}
</feed>`;
}

function generateAtomEntry(post: BlogPost, siteUrl: string): string {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const published = new Date(post.publishedAt).toISOString();
  const updated = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : published;

  return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(postUrl)}" />
    <id>${escapeXml(postUrl)}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <summary>${escapeXml(post.excerpt)}</summary>
    <content type="html"><![CDATA[${post.content}]]></content>
    ${post.tags.map((tag) => `<category term="${escapeXml(tag)}" />`).join("\n    ")}
  </entry>`;
}

// Generate JSON Feed (modern format)
export function generateJSONFeed(posts: BlogPost[], config: RSSConfig): string {
  const { title, description, siteUrl, feedUrl, author } = config;

  const items = posts
    .filter((post) => post.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map((post) => ({
      id: `${siteUrl}/blog/${post.slug}`,
      url: `${siteUrl}/blog/${post.slug}`,
      title: post.title,
      content_html: post.content,
      summary: post.excerpt,
      image: post.coverImage,
      date_published: new Date(post.publishedAt).toISOString(),
      date_modified: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : new Date(post.publishedAt).toISOString(),
      tags: post.tags,
    }));

  return JSON.stringify(
    {
      version: "https://jsonfeed.org/version/1.1",
      title,
      description,
      home_page_url: siteUrl,
      feed_url: feedUrl,
      icon: `${siteUrl}/icons/icon-512x512.png`,
      favicon: `${siteUrl}/icons/icon-192x192.png`,
      author: {
        name: author,
      },
      items,
    },
    null,
    2
  );
}
