import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const sources = [
  {
    name: "Erasmus+ Opportunities",
    url: "https://erasmus-plus.ec.europa.eu/opportunities/organisations/cooperation-among-organisations-and-institutions",
    description:
      "EU-funded scholarships, exchanges, and cooperation programs for students worldwide",
  },
  {
    name: "DAAD Scholarships",
    url: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/",
    description:
      "German Academic Exchange Service scholarship database for international students",
  },
  {
    name: "Chevening Scholarships",
    url: "https://www.chevening.org/scholarships/",
    description:
      "UK government fully-funded master's degree scholarships for future leaders",
  },
  {
    name: "UN Volunteers",
    url: "https://www.unv.org/become-volunteer",
    description:
      "United Nations volunteer opportunities worldwide for peace and development",
  },
  {
    name: "Opportunities for Africans (also Central Asia)",
    url: "https://www.opportunitiesforafricans.com/category/asia/",
    description:
      "Aggregator of scholarships and opportunities also covering Central Asian countries",
  },
  {
    name: "AIESEC Opportunities",
    url: "https://aiesec.org/search?type=0",
    description:
      "Youth leadership development through global volunteer and internship exchanges",
  },
  {
    name: "Study in Korea (KGSP)",
    url: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do",
    description:
      "Korean Government Scholarship Program for international students",
  },
  {
    name: "Fulbright Program",
    url: "https://foreign.fulbrightonline.org/",
    description:
      "US government sponsored exchange program for students and scholars",
  },
];

async function main() {
  for (const source of sources) {
    await prisma.scoutedSource.upsert({
      where: { url: source.url },
      update: {},
      create: source,
    });
  }
  console.log(`Seeded ${sources.length} scouter sources`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
