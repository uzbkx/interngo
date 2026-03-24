import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ExtractedOpportunity {
  title: string;
  type: "INTERNSHIP" | "SCHOLARSHIP" | "PROGRAM" | "VOLUNTEER" | "JOB" | "OTHER";
  description: string;
  country?: string;
  city?: string;
  isRemote?: boolean;
  isPaid?: boolean;
  salary?: string;
  currency?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  applyUrl?: string;
  confidence?: number; // 0-100, how confident the AI is about this extraction
}

export async function extractOpportunities(
  pageContent: string,
  sourceUrl: string,
  sourceName: string
): Promise<ExtractedOpportunity[]> {
  const currentDate = new Date().toISOString().split("T")[0];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are an AI scouter for InternGo, a platform that helps students in Uzbekistan find internships, scholarships, and international programs.

Today's date: ${currentDate}

Analyze the following webpage content from "${sourceName}" (${sourceUrl}) and extract ALL current/upcoming opportunities (internships, scholarships, programs, volunteering, jobs).

IMPORTANT RULES:
- Only extract opportunities that are CURRENTLY OPEN for applications (deadline hasn't passed or no deadline mentioned)
- Skip any opportunities whose deadline is before ${currentDate}
- Each opportunity must have a clear, specific title (not generic like "scholarship program")
- Descriptions should be 2-4 sentences summarizing what the opportunity is, who it's for, and key benefits
- Be specific with dates — use ISO format YYYY-MM-DD

For each opportunity, extract:
- title: Clear, descriptive title
- type: One of INTERNSHIP, SCHOLARSHIP, PROGRAM, VOLUNTEER, JOB, OTHER
- description: 2-4 sentence summary
- country: Country where it takes place
- city: City (if mentioned)
- isRemote: true/false
- isPaid: true/false
- salary: Compensation amount (if mentioned)
- currency: Currency code (USD, EUR, etc.)
- deadline: Application deadline YYYY-MM-DD (if mentioned)
- startDate: Start date YYYY-MM-DD (if mentioned)
- endDate: End date YYYY-MM-DD (if mentioned)
- applyUrl: Direct application URL (if found, otherwise use the source URL)
- confidence: 0-100 how confident you are this is a real, currently active opportunity with accurate details

Return a JSON array. If no valid opportunities found, return [].
Only return the JSON array, no other text.

PAGE CONTENT:
${pageContent.slice(0, 15000)}`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}

export async function discoverSources(topic: string): Promise<
  { name: string; url: string; description: string }[]
> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are an AI scouter for InternGo, a platform helping students in Uzbekistan find international opportunities.

Suggest 10 websites/sources that regularly post ${topic} for international students. Focus on:
- Well-known scholarship databases and aggregators
- International organization program pages (UN, EU, USAID, etc.)
- Government-funded exchange programs
- Reputable internship aggregators
- Programs specifically open to Central Asian / Uzbek students
- Regional opportunity hubs

For each source, provide:
- name: Organization/website name
- url: The specific page URL that lists opportunities (not just homepage)
- description: What kind of opportunities they post

Return a JSON array. Only return the JSON array, no other text.`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Failed to parse AI discovery response:", error);
    return [];
  }
}

export async function checkDuplicate(
  newTitle: string,
  existingTitles: string[]
): Promise<boolean> {
  if (existingTitles.length === 0) return false;

  // Simple fuzzy match — check if any existing title is very similar
  const normalizedNew = newTitle.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  for (const existing of existingTitles) {
    const normalizedExisting = existing
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "");
    // Exact or near-exact match
    if (normalizedNew === normalizedExisting) return true;
    // One contains the other
    if (
      normalizedNew.includes(normalizedExisting) ||
      normalizedExisting.includes(normalizedNew)
    ) {
      return true;
    }
    // Word overlap > 80%
    const newWords = new Set(normalizedNew.split(/\s+/));
    const existingWords = new Set(normalizedExisting.split(/\s+/));
    const overlap = [...newWords].filter((w) => existingWords.has(w)).length;
    const maxLen = Math.max(newWords.size, existingWords.size);
    if (maxLen > 0 && overlap / maxLen > 0.8) return true;
  }

  return false;
}
