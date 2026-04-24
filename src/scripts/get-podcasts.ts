import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const FEED_URL = "https://neurosense.substack.com/feed";
const OUTPUT_DIR = join(process.cwd(), "src/content/podcasts");

const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04",
  May: "05", Jun: "06", Jul: "07", Aug: "08",
  Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function parsePubDate(dateStr: string) {
  const parts = dateStr.split(" ");
  return { day: parts[1], month: parts[2], year: parseInt(parts[3]) };
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]+>/g, "").trim();
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Fetch the episode page and extract the og:image meta tag URL. */
async function scrapeOgImage(pageUrl: string): Promise<string> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; podcast-scraper/1.0)" },
    });
    if (!res.ok) {
      console.warn(`  ⚠ Could not fetch page (${res.status}): ${pageUrl}`);
      return "";
    }
    // Only read the <head> — og tags are always there, avoids loading the full body
    const html = await res.text();
    const headEnd = html.indexOf("</head>");
    const head = headEnd !== -1 ? html.slice(0, headEnd) : html.slice(0, 8000);

    const match =
      head.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/) ??
      head.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/);

    return match ? decodeHtmlEntities(match[1]) : "";
  } catch (err) {
    console.warn(`  ⚠ Error scraping ${pageUrl}:`, err);
    return "";
  }
}

async function main() {
  const res = await fetch(FEED_URL);
  const xml = await res.text();

  // Split on opening <item> tags rather than matching the whole block,
  // which avoids regex backtracking issues with large CDATA sections
  const itemChunks = xml.split("<item>").slice(1).map((chunk) => {
    // Take everything up to </item> — but </item> might not exist if it's
    // the last item, so fall back to the whole chunk
    const end = chunk.indexOf("</item>");
    return end !== -1 ? chunk.slice(0, end) : chunk;
  });

  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (let i = 0; i < itemChunks.length; i++) {
    const item = itemChunks[i];

    // Helper: extract CDATA or plain text from a tag, handling multiline
    function extractField(tag: string): string {
      // Try CDATA first
      const cdataRe = new RegExp(`<${tag}>[\\s]*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>[\\s]*<\\/${tag}>`, "m");
      const cdataMatch = item.match(cdataRe);
      if (cdataMatch) return cdataMatch[1].trim();

      // Fall back to plain text
      const plainRe = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "m");
      const plainMatch = item.match(plainRe);
      return plainMatch ? plainMatch[1].trim() : "";
    }

    function extractDescription(): string {
      const raw = extractField("content:encoded");

      // Cut off at the Substack subscription widget
      const cutoff = raw.indexOf('<div class="subscription-widget-wrap-editor"');
      const trimmed = cutoff !== -1 ? raw.slice(0, cutoff) : raw;

      return decodeHtmlEntities(trimmed.trim());
    }

    const audioUrl = item.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] ?? "";

    // Skip non-MP3 items early so we don't waste fetches on them
    if (!audioUrl.endsWith("mp3")) continue;

    const description = extractDescription();
    const title = decodeHtmlEntities(extractField("title"));
    const subtitle = decodeHtmlEntities(extractField("itunes:subtitle"));
    const url = extractField("link") || extractField("guid");
    const duration = extractField("itunes:duration");
    const slug = slugify(title);
    const pubDateRaw = extractField("pubDate");
    const pubDate = parsePubDate(pubDateRaw);

    // Prefer RSS-supplied image; fall back to scraping the episode page
    let imageUrl =
      item.match(/<itunes:image[^>]+href="([^"]+)"/)?.[1] ??
      item.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] ??
      "";

    if (!imageUrl && url) {
      console.log(`  → No RSS image for "${title}", scraping page…`);
      imageUrl = await scrapeOgImage(url);
    }

    // Log what we found to help diagnose
    console.log(`--- Episode ${i + 1}: ${title}`);
    console.log(`  chosen description: ${description.slice(0, 120)}...`);
    console.log(`  audioUrl:  ${audioUrl}`);
    console.log(`  imageUrl:  ${imageUrl}`);

    const entry = {
      url,
      pubDate,
      title,
      subtitle,
      description,
      audioUrl,
      duration,
      imageUrl,
      imageFileName: `${slug}.jpeg`,
    };

    const filename = String(i + 1).padStart(9, "0") + ".json";
    writeFileSync(join(OUTPUT_DIR, filename), JSON.stringify(entry, null, 4));
    console.log(`✓ ${filename} — ${title}`);
  }
}

main().catch(console.error);