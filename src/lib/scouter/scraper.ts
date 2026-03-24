import * as cheerio from "cheerio";

export async function scrapeUrl(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; InternGoBot/1.0; +https://interngo.uz)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return extractTextContent(html);
  } finally {
    clearTimeout(timeout);
  }
}

function extractTextContent(html: string): string {
  const $ = cheerio.load(html);

  // Remove non-content elements
  $(
    "script, style, nav, footer, header, iframe, noscript, svg, img, video, audio"
  ).remove();
  $('[role="navigation"], [role="banner"], [role="contentinfo"]').remove();
  $(".nav, .navbar, .footer, .sidebar, .menu, .cookie, .popup, .modal").remove();

  // Get main content area if it exists
  const mainContent =
    $("main").text() ||
    $('[role="main"]').text() ||
    $("article").text() ||
    $(".content, .main, #content, #main").text();

  const text = (mainContent || $("body").text())
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();

  // Limit to ~15k chars to stay within token limits
  return text.slice(0, 15000);
}
