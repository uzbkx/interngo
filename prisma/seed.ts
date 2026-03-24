import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create categories
  const categories = await Promise.all(
    [
      { name: "Technology", slug: "technology" },
      { name: "Business", slug: "business" },
      { name: "Engineering", slug: "engineering" },
      { name: "Medicine", slug: "medicine" },
      { name: "Arts & Design", slug: "arts-design" },
      { name: "Education", slug: "education" },
      { name: "Science", slug: "science" },
      { name: "Law", slug: "law" },
      { name: "Social Sciences", slug: "social-sciences" },
      { name: "Environment", slug: "environment" },
    ].map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  // Create listings
  const listings = [
    {
      title: "Software Engineering Intern at Google",
      slug: "software-engineering-intern-google",
      type: "INTERNSHIP" as const,
      status: "PUBLISHED" as const,
      source: "AI_SCOUTED" as const,
      description:
        "Join Google's engineering team for a 12-week summer internship. Work on real products used by billions of people worldwide. You'll collaborate with a team of engineers on a specific project, write production-quality code, and participate in design and code reviews.",
      location: "Mountain View, CA",
      country: "USA",
      isRemote: false,
      isPaid: true,
      salary: "$8,000",
      currency: "USD",
      applyUrl: "https://careers.google.com",
      deadline: new Date("2026-05-01"),
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-09-15"),
      categorySlugs: ["technology"],
    },
    {
      title: "Erasmus Mundus Joint Master Scholarship 2026",
      slug: "erasmus-mundus-scholarship-2026",
      type: "SCHOLARSHIP" as const,
      status: "PUBLISHED" as const,
      source: "AI_SCOUTED" as const,
      description:
        "Fully funded scholarship covering tuition, travel, and living costs for a joint master's degree in EU universities. Benefits include full tuition fee coverage, monthly living allowance, travel and installation costs, and insurance. Priority given to applicants from partner countries including Uzbekistan.",
      country: "Europe",
      isRemote: false,
      isPaid: true,
      salary: "Full funding",
      currency: "EUR",
      applyUrl: "https://erasmus-plus.ec.europa.eu",
      deadline: new Date("2026-04-15"),
      startDate: new Date("2026-09-01"),
      categorySlugs: ["education"],
    },
    {
      title: "UN Youth Delegate Programme",
      slug: "un-youth-delegate-programme",
      type: "PROGRAM" as const,
      status: "PUBLISHED" as const,
      source: "AI_SCOUTED" as const,
      description:
        "Represent your country's youth at the United Nations General Assembly. A unique opportunity for young leaders aged 18-24 to engage in international diplomacy, attend high-level meetings, and contribute to global policy discussions.",
      location: "New York",
      country: "USA",
      isRemote: false,
      isPaid: false,
      applyUrl: "https://www.un.org/youth",
      deadline: new Date("2026-06-30"),
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-12-15"),
      categorySlugs: ["social-sciences"],
    },
    {
      title: "AIESEC Global Volunteer",
      slug: "aiesec-global-volunteer",
      type: "VOLUNTEER" as const,
      status: "PUBLISHED" as const,
      source: "USER_SUBMITTED" as const,
      description:
        "Volunteer abroad for 6-8 weeks on projects focused on education, environment, or community development. AIESEC offers cross-cultural experiences in 120+ countries. No experience required — just a passion for making a difference.",
      country: "Various",
      isRemote: false,
      isPaid: false,
      applyUrl: "https://aiesec.org",
      categorySlugs: ["education", "environment"],
    },
    {
      title: "Remote Data Science Internship",
      slug: "remote-data-science-internship",
      type: "INTERNSHIP" as const,
      status: "PUBLISHED" as const,
      source: "USER_SUBMITTED" as const,
      description:
        "Work remotely on data science projects, build ML models, and contribute to open-source educational content. Ideal for students with Python and statistics background. Flexible hours, mentorship included.",
      isRemote: true,
      isPaid: true,
      salary: "$2,000",
      currency: "USD",
      deadline: new Date("2026-04-01"),
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-08-01"),
      categorySlugs: ["technology", "science"],
    },
    {
      title: "Chevening Scholarship UK",
      slug: "chevening-scholarship-uk",
      type: "SCHOLARSHIP" as const,
      status: "PUBLISHED" as const,
      source: "AI_SCOUTED" as const,
      description:
        "Fully funded master's degree in any UK university. Covers tuition, living expenses, and flights. Chevening is the UK government's international scholarships programme. Open to citizens of Uzbekistan with at least 2 years of work experience.",
      country: "United Kingdom",
      isRemote: false,
      isPaid: true,
      salary: "Full funding",
      currency: "GBP",
      applyUrl: "https://www.chevening.org",
      deadline: new Date("2026-11-01"),
      startDate: new Date("2027-09-01"),
      categorySlugs: ["education"],
    },
    {
      title: "DAAD Scholarship for Master's in Germany",
      slug: "daad-scholarship-germany",
      type: "SCHOLARSHIP" as const,
      status: "PUBLISHED" as const,
      source: "AI_SCOUTED" as const,
      description:
        "The German Academic Exchange Service (DAAD) offers scholarships for international students to pursue a master's degree in Germany. Covers monthly stipend, health insurance, travel allowance, and study allowance. Programs available in English and German.",
      country: "Germany",
      isRemote: false,
      isPaid: true,
      salary: "€934/month",
      currency: "EUR",
      applyUrl: "https://www.daad.de",
      deadline: new Date("2026-10-15"),
      startDate: new Date("2027-04-01"),
      categorySlugs: ["education", "engineering"],
    },
    {
      title: "Microsoft Explore Internship",
      slug: "microsoft-explore-internship",
      type: "INTERNSHIP" as const,
      status: "PUBLISHED" as const,
      source: "AI_SCOUTED" as const,
      description:
        "A 12-week rotational internship at Microsoft for first and second-year university students. Rotate between program management, software engineering, and design roles. Gain broad exposure to the tech industry with world-class mentorship.",
      location: "Redmond, WA",
      country: "USA",
      isRemote: false,
      isPaid: true,
      salary: "$7,500",
      currency: "USD",
      applyUrl: "https://careers.microsoft.com",
      deadline: new Date("2026-04-30"),
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-08-31"),
      categorySlugs: ["technology"],
    },
    {
      title: "Teach For All Fellowship",
      slug: "teach-for-all-fellowship",
      type: "PROGRAM" as const,
      status: "PUBLISHED" as const,
      source: "USER_SUBMITTED" as const,
      description:
        "A 2-year leadership development program where you teach in underserved communities. Develop leadership skills while making a real impact on educational equity. Available in 60+ countries with local partner organizations.",
      country: "Various",
      isRemote: false,
      isPaid: true,
      salary: "Living stipend",
      applyUrl: "https://teachforall.org",
      deadline: new Date("2026-05-15"),
      startDate: new Date("2026-08-01"),
      categorySlugs: ["education"],
    },
    {
      title: "Remote UX Design Internship",
      slug: "remote-ux-design-internship",
      type: "INTERNSHIP" as const,
      status: "PUBLISHED" as const,
      source: "USER_SUBMITTED" as const,
      description:
        "Join a growing startup as a remote UX design intern. Work on real product features, conduct user research, create wireframes and prototypes. Great for design students looking to build their portfolio.",
      isRemote: true,
      isPaid: true,
      salary: "$1,500",
      currency: "USD",
      deadline: new Date("2026-04-20"),
      startDate: new Date("2026-05-15"),
      endDate: new Date("2026-08-15"),
      categorySlugs: ["arts-design", "technology"],
    },
    {
      title: "Korean Government Scholarship Program (KGSP)",
      slug: "kgsp-korea-scholarship",
      type: "SCHOLARSHIP" as const,
      status: "PUBLISHED" as const,
      source: "AI_SCOUTED" as const,
      description:
        "Fully funded scholarship for undergraduate and graduate studies in South Korea. Includes 1-year Korean language training, full tuition, monthly living allowance, airfare, and medical insurance. Open to citizens of Uzbekistan.",
      country: "South Korea",
      isRemote: false,
      isPaid: true,
      salary: "Full funding",
      applyUrl: "https://www.studyinkorea.go.kr",
      deadline: new Date("2026-03-31"),
      startDate: new Date("2026-09-01"),
      categorySlugs: ["education"],
    },
    {
      title: "WWF Conservation Volunteer Program",
      slug: "wwf-conservation-volunteer",
      type: "VOLUNTEER" as const,
      status: "PUBLISHED" as const,
      source: "AI_SCOUTED" as const,
      description:
        "Volunteer with the World Wildlife Fund on conservation projects worldwide. Projects range from wildlife monitoring to sustainable community development. Duration: 2-12 weeks. Accommodation and meals provided.",
      country: "Various",
      isRemote: false,
      isPaid: false,
      applyUrl: "https://www.worldwildlife.org",
      deadline: new Date("2026-07-31"),
      categorySlugs: ["environment", "science"],
    },
  ];

  for (const listing of listings) {
    const { categorySlugs, ...data } = listing;
    const created = await prisma.listing.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });

    // Connect categories
    for (const slug of categorySlugs) {
      const category = categories.find((c) => c.slug === slug);
      if (category) {
        await prisma.listingCategory.upsert({
          where: {
            listingId_categoryId: {
              listingId: created.id,
              categoryId: category.id,
            },
          },
          update: {},
          create: {
            listingId: created.id,
            categoryId: category.id,
          },
        });
      }
    }
  }

  console.log("Seed complete: 10 categories, 12 listings");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
