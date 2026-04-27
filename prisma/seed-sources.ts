import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const sources = [
  // ── EU / European national scholarships ───────────────────────────────────
  { name: "Erasmus+ Opportunities", url: "https://erasmus-plus.ec.europa.eu/opportunities", description: "EU-funded scholarships, exchanges, and cooperation programs for students worldwide" },
  { name: "DAAD Scholarship Database", url: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/", description: "German Academic Exchange Service scholarship database for international students" },
  { name: "Holland Scholarship", url: "https://www.studyinholland.nl/scholarships/holland-scholarship", description: "Dutch government scholarship for non-EEA bachelor and master students" },
  { name: "Swiss Government Excellence Scholarships", url: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html", description: "Postgraduate research and arts scholarships from the Swiss Confederation" },
  { name: "Eiffel Excellence Scholarship (France)", url: "https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence", description: "French government scholarship for master's and PhD students" },
  { name: "Italian Government Bilateral Scholarships", url: "https://studyinitaly.esteri.it/en/borse-di-studio", description: "Italian Ministry of Foreign Affairs scholarships for international students" },
  { name: "NAWA Polish Scholarships", url: "https://nawa.gov.pl/en/foreigners", description: "Polish National Agency for Academic Exchange scholarships" },
  { name: "Czech Government Scholarships", url: "https://www.msmt.cz/eu-and-international-affairs/government-scholarships-developing-countries", description: "Government scholarships for nationals of developing countries to study in Czechia" },
  { name: "Stipendium Hungaricum", url: "https://stipendiumhungaricum.hu/", description: "Hungarian government full-tuition scholarship — Uzbekistan is partner country" },
  { name: "Austria's Grants (OeAD)", url: "https://grants.at/", description: "Austrian Agency for Education and Internationalisation scholarship database" },
  { name: "Spanish MAEC-AECID Scholarships", url: "https://www.aecid.gob.es/en/becas-y-lectorados", description: "Spanish Agency for International Development Cooperation grants" },
  { name: "Swedish Institute Scholarships", url: "https://si.se/en/apply/scholarships/", description: "Swedish Institute scholarships for global professionals" },
  { name: "Finnish Government Scholarship Pool", url: "https://www.edufi.fi/scholarships", description: "EDUFI Fellowship and other Finnish government grants" },
  { name: "Norwegian Government Quota Scheme", url: "https://www.studyinnorway.no/", description: "Norwegian higher education for international students" },
  { name: "Romanian Government Scholarships", url: "https://www.mae.ro/en/node/10251", description: "Romanian Ministry of Foreign Affairs scholarships for foreigners" },
  { name: "Slovak Government Scholarships", url: "https://www.scholarships.sk/", description: "National scholarship programme of the Slovak Republic" },

  // ── UK programs ───────────────────────────────────────────────────────────
  { name: "Chevening Scholarships", url: "https://www.chevening.org/scholarships/", description: "UK government fully-funded master's degree scholarships" },
  { name: "Commonwealth Scholarships", url: "https://cscuk.fcdo.gov.uk/scholarships/", description: "UK government scholarships for low/middle-income Commonwealth citizens" },
  { name: "Rhodes Scholarships", url: "https://www.rhodeshouse.ox.ac.uk/scholarships/", description: "Postgraduate award to study at Oxford for outstanding young leaders" },
  { name: "Gates Cambridge Scholarship", url: "https://www.gatescambridge.org/apply/", description: "Full-cost scholarship for outstanding postgraduate students at Cambridge" },
  { name: "Marshall Scholarships", url: "https://www.marshallscholarship.org/", description: "British government scholarship for Americans to study in the UK" },
  { name: "GREAT Scholarships", url: "https://www.britishcouncil.org/study-uk/scholarships/great", description: "UK government and university scholarships for international students" },
  { name: "Clarendon Scholarships (Oxford)", url: "https://www.ox.ac.uk/clarendon", description: "Oxford full-cost graduate scholarship covering fees and stipend" },
  { name: "Reach Oxford Scholarships", url: "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-support/reach-oxford-scholarships", description: "Oxford undergraduate scholarship for low-income developing-country students" },
  { name: "Edinburgh Global Scholarships", url: "https://www.ed.ac.uk/global/scholarships", description: "University of Edinburgh international scholarship portal" },

  // ── US programs ───────────────────────────────────────────────────────────
  { name: "Fulbright Foreign Student Program", url: "https://foreign.fulbrightonline.org/", description: "US government sponsored exchange program for graduate students" },
  { name: "Hubert H. Humphrey Fellowship", url: "https://www.humphreyfellowship.org/", description: "Non-degree US program for mid-career professionals from developing countries" },
  { name: "Yale World Fellows", url: "https://worldfellows.yale.edu/", description: "Yale fellowship for emerging global leaders" },
  { name: "Knight-Hennessy Scholars (Stanford)", url: "https://knight-hennessy.stanford.edu/", description: "Stanford fully-funded graduate scholarship for global leaders" },
  { name: "Rotary Peace Fellowships", url: "https://www.rotary.org/en/our-programs/peace-fellowships", description: "Master's and certificate programs in peace and conflict studies" },
  { name: "Mason Fellows (Harvard Kennedy School)", url: "https://www.hks.harvard.edu/educational-programs/masters-programs/mpa-mid-career/mason-program", description: "Mid-career master's program at HKS for public-sector leaders" },
  { name: "Yale Young Global Scholars", url: "https://globalscholars.yale.edu/", description: "Two-week academic enrichment program for high school students" },
  { name: "OAS Academic Scholarships", url: "https://www.oas.org/en/scholarships/regular_program.asp", description: "Organization of American States scholarships for OAS member-state nationals" },
  { name: "Atlas Corps Fellowship", url: "https://atlascorps.org/atlas-corps-fellowship/", description: "Yearlong professional fellowship in the US for global social-impact leaders" },
  { name: "Eisenhower Fellowships", url: "https://www.efworld.org/", description: "Multi-week leadership fellowship for mid-career professionals" },

  // ── Asia-Pacific programs ────────────────────────────────────────────────
  { name: "Korean Government Scholarship (KGSP/GKS)", url: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do", description: "Korean Government Scholarship Program for international students" },
  { name: "MEXT Scholarship (Japan)", url: "https://www.studyinjapan.go.jp/en/planning/scholarship/applying.html", description: "Japanese government scholarship for international students" },
  { name: "ADB-Japan Scholarship Program", url: "https://www.adb.org/work-with-us/careers/japan-scholarship-program", description: "Asian Development Bank scholarship for postgrad study in Asia-Pacific" },
  { name: "China Scholarship Council", url: "https://www.campuschina.org/", description: "Official portal for Chinese government scholarships" },
  { name: "Singapore International Graduate Award", url: "https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa", description: "PhD scholarship for international students in Singapore" },
  { name: "Australia Awards Scholarships", url: "https://www.dfat.gov.au/people-to-people/australia-awards/scholarships", description: "Australian government international scholarships" },
  { name: "New Zealand Scholarships", url: "https://www.mfat.govt.nz/en/aid-and-development/scholarships/", description: "MFAT scholarships for international students from developing countries" },
  { name: "Mitsubishi UFJ Foundation Scholarship", url: "https://www.muff.or.jp/en/", description: "Mitsubishi UFJ Foundation grants for cross-cultural understanding" },
  { name: "ASEAN Scholarships", url: "https://asean.org/our-communities/asean-socio-cultural-community/education/asean-scholarships/", description: "ASEAN-funded scholarships for member-state students" },

  // ── UN & international organizations ──────────────────────────────────────
  { name: "UN Volunteers", url: "https://www.unv.org/become-volunteer", description: "United Nations volunteer opportunities worldwide" },
  { name: "UNESCO Internships", url: "https://en.unesco.org/careers/internships", description: "UNESCO internship programme in Paris and field offices" },
  { name: "UNICEF Internship Programme", url: "https://www.unicef.org/careers/internships", description: "UNICEF internships for students and recent graduates" },
  { name: "WHO Internship Programme", url: "https://www.who.int/careers/internship-programme", description: "World Health Organization internship for graduate students" },
  { name: "World Bank Group Internship", url: "https://www.worldbank.org/en/about/careers/programs-and-internships/internship", description: "World Bank summer/winter internship program" },
  { name: "IMF Internship Program", url: "https://www.imf.org/en/About/Working-at-IMF/internships", description: "International Monetary Fund Fund Internship Program (FIP)" },
  { name: "ILO Internship", url: "https://www.ilo.org/intern/lang--en/index.htm", description: "International Labour Organization internships in Geneva and field" },
  { name: "OECD Internship Programme", url: "https://www.oecd.org/careers/internshipprogramme/", description: "OECD internships across policy areas" },
  { name: "UNDP Internships", url: "https://www.undp.org/careers/internships", description: "United Nations Development Programme internships" },
  { name: "UNHCR Internships", url: "https://www.unhcr.org/careers", description: "UN Refugee Agency internship and Junior Professional Officer programme" },
  { name: "WFP Internships", url: "https://www.wfp.org/careers/internships", description: "World Food Programme internship programme" },
  { name: "ICRC Internships", url: "https://careers.icrc.org/", description: "International Committee of the Red Cross careers and internships" },
  { name: "AIIB Young Professionals", url: "https://www.aiib.org/en/opportunities/career/junior-professional-program/index.html", description: "Asian Infrastructure Investment Bank junior professional program" },

  // ── Aggregators (high opportunity volume) ─────────────────────────────────
  { name: "Opportunity Desk", url: "https://opportunitydesk.org/", description: "Daily aggregator of fellowships, scholarships and conferences" },
  { name: "Opportunities For Africans (also Asia)", url: "https://www.opportunitiesforafricans.com/category/asia/", description: "Aggregator of scholarships and opportunities also covering Asia" },
  { name: "ScholarshipPortal", url: "https://www.scholarshipportal.com/", description: "Database of ~3,000 international scholarships at European universities" },
  { name: "Scholarship Positions", url: "https://scholarship-positions.com/", description: "Aggregator of international scholarships, fellowships and grants" },
  { name: "Opportunities for Youth", url: "https://opportunitiesforyouth.org/", description: "Aggregator of fellowships, jobs, scholarships for global youth" },
  { name: "After School Africa", url: "https://www.afterschoolafrica.com/", description: "Scholarships and opportunities aggregator (also relevant globally)" },
  { name: "Youth Opportunities Hub", url: "https://www.youthop.com/", description: "Listing site for fellowships, internships, exchanges" },
  { name: "DAAD Funding Database", url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/", description: "DAAD funding database covering all German scholarships" },
  { name: "Top Universities Scholarships", url: "https://www.topuniversities.com/scholarships", description: "QS Top Universities scholarship listing for international students" },
  { name: "FindAPhD", url: "https://www.findaphd.com/funding/", description: "PhD funding listings worldwide" },
  { name: "Studyportals Scholarships", url: "https://www.studyportals.com/scholarships/", description: "Filter scholarships by country, study level, field" },

  // ── Volunteer platforms ───────────────────────────────────────────────────
  { name: "AIESEC Opportunities", url: "https://aiesec.org/search?type=0", description: "Youth leadership development through global volunteer and internship exchanges" },
  { name: "IAESTE Internships", url: "https://iaeste.org/students", description: "Technical internships abroad for STEM students" },
  { name: "WWOOF World", url: "https://wwoof.net/", description: "Worldwide opportunities on organic farms (volunteer for room & board)" },
  { name: "Workaway", url: "https://www.workaway.info/", description: "Cultural exchange volunteering worldwide" },
  { name: "GoOverseas Volunteer", url: "https://www.gooverseas.com/volunteer-abroad", description: "Volunteer abroad program directory" },
  { name: "Global Volunteers", url: "https://globalvolunteers.org/", description: "Short-term volunteer service trips worldwide" },
  { name: "VolunteerHQ", url: "https://www.volunteerhq.org/", description: "Affordable international volunteer programs" },
  { name: "Idealist", url: "https://www.idealist.org/en/volunteer", description: "Global volunteer and nonprofit job board" },
  { name: "Volunteer Forever", url: "https://www.volunteerforever.com/", description: "Volunteer abroad and crowdfunding platform" },
  { name: "ESC European Solidarity Corps", url: "https://europa.eu/youth/solidarity_en", description: "EU programme for young people doing volunteer or work projects" },

  // ── Tech / corporate internships ──────────────────────────────────────────
  { name: "Google Careers Internships", url: "https://careers.google.com/students/", description: "Google internships, BOLD, STEP, and student programs" },
  { name: "Microsoft Internships", url: "https://careers.microsoft.com/students/us/en/internshipprograms", description: "Microsoft internship and student programs worldwide" },
  { name: "Meta University", url: "https://www.metacareers.com/careerprograms/students/", description: "Meta internships and student programs" },
  { name: "Amazon Student Programs", url: "https://www.amazon.jobs/en/teams/internships-for-students", description: "Amazon internships and student opportunities" },
  { name: "Apple Internships", url: "https://www.apple.com/careers/us/students.html", description: "Apple internship programs across software, hardware, design" },
  { name: "Bloomberg Internships", url: "https://www.bloomberg.com/company/early-careers/", description: "Bloomberg internship programs for students" },
  { name: "IBM Internships", url: "https://www.ibm.com/employment/internships/", description: "IBM summer internships across technology and consulting" },
  { name: "Adobe Internships", url: "https://www.adobe.com/careers/university.html", description: "Adobe student programs and internships" },
  { name: "Spotify Internships", url: "https://www.lifeatspotify.com/students", description: "Spotify summer internships and student programs" },
  { name: "Goldman Sachs Internships", url: "https://www.goldmansachs.com/careers/students/programs/", description: "Goldman Sachs summer internship and analyst programs" },
  { name: "JP Morgan Programs", url: "https://www.jpmorganchase.com/careers/students-and-graduates", description: "JP Morgan student internship and graduate programs" },
  { name: "McKinsey Internships", url: "https://www.mckinsey.com/careers/students", description: "McKinsey student insights, internships, and full-time programs" },
  { name: "BCG Internships", url: "https://careers.bcg.com/students", description: "Boston Consulting Group internship and full-time student programs" },

  // ── Open-source / coding internships ──────────────────────────────────────
  { name: "Google Summer of Code", url: "https://summerofcode.withgoogle.com/", description: "Paid open-source summer coding program for students" },
  { name: "Outreachy", url: "https://www.outreachy.org/", description: "Paid open-source internships for underrepresented groups" },
  { name: "MLH Fellowship", url: "https://fellowship.mlh.io/", description: "12-week paid open-source software engineering fellowship" },
  { name: "LFX Mentorship", url: "https://lfx.linuxfoundation.org/tools/mentorship/", description: "Linux Foundation mentorship program for open-source projects" },
  { name: "Google Season of Docs", url: "https://developers.google.com/season-of-docs", description: "Stipend program for technical writers in open-source" },
  { name: "Hacktoberfest", url: "https://hacktoberfest.com/", description: "Annual open-source contribution event with prizes" },

  // ── Fellowships & leadership programs ────────────────────────────────────
  { name: "Mandela Washington Fellowship", url: "https://www.mandelawashingtonfellowship.org/", description: "US-government leadership program for young African leaders" },
  { name: "One Young World Summit", url: "https://www.oneyoungworld.com/summit", description: "Global youth leadership summit and scholarship programme" },
  { name: "Global Shapers (WEF)", url: "https://www.globalshapers.org/", description: "World Economic Forum local-impact community for young leaders under 30" },
  { name: "Acumen Fellows", url: "https://acumenacademy.org/fellowships/", description: "Acumen yearlong leadership accelerator for social entrepreneurs" },
  { name: "Aspen New Voices Fellowship", url: "https://www.aspeninstitute.org/programs/aspen-new-voices-fellowship/", description: "Yearlong media and policy fellowship for global development experts" },
  { name: "Carnegie Council New Leaders", url: "https://www.carnegiecouncil.org/about/the-carnegie-new-leaders", description: "Network for emerging leaders in ethics in international affairs" },
  { name: "Forbes Under 30 Summit", url: "https://www.forbes.com/under30/", description: "Forbes Under 30 awards, summits, and scholar program" },
  { name: "Schwarzman Scholars", url: "https://www.schwarzmanscholars.org/", description: "One-year master's at Tsinghua for future global leaders" },
  { name: "TED Fellows", url: "https://www.ted.com/about/programs-initiatives/ted-fellows-program", description: "TED fellowship for innovators with bold ideas" },
  { name: "Echoing Green Fellows", url: "https://echoinggreen.org/fellowship/", description: "Two-year fellowship and seed funding for social entrepreneurs" },
  { name: "Halcyon Fellowship", url: "https://halcyonhouse.org/incubator", description: "Five-month residential incubator for early-stage social ventures" },
  { name: "Mozilla Fellowship", url: "https://foundation.mozilla.org/en/fellowships/", description: "Internet-health fellowships for technologists, researchers, advocates" },

  // ── Research opportunities ────────────────────────────────────────────────
  { name: "Max Planck PhD Programs", url: "https://www.imprs.mpg.de/", description: "International Max Planck Research Schools (IMPRS) PhD programs" },
  { name: "EMBL International PhD", url: "https://www.embl.org/training/phd/", description: "European Molecular Biology Laboratory predoctoral fellowships" },
  { name: "Pasteur Network Fellowships", url: "https://pasteur-network.org/en/funding-and-careers/", description: "Institut Pasteur and partner institutes research funding" },
  { name: "Salk Institute Fellowships", url: "https://www.salk.edu/postdoctoral-resource-center/", description: "Salk Institute postdoctoral fellowships in biology" },
  { name: "DAAD RISE Worldwide", url: "https://www.daad.de/rise/en/rise-worldwide/", description: "DAAD summer research internships in Germany for STEM students" },
  { name: "Mitacs Globalink", url: "https://www.mitacs.ca/en/programs/globalink", description: "Canadian summer research internship for international students" },
  { name: "CERN Summer Student Programme", url: "https://careers.cern/summer", description: "Summer student program at CERN for physics, engineering, computing" },
  { name: "DESY Summer Student Programme", url: "https://summerstudents.desy.de/", description: "Summer student research at DESY laboratories in Germany" },
  { name: "Caltech SURF", url: "https://sfp.caltech.edu/programs/surf", description: "Caltech Summer Undergraduate Research Fellowship" },
  { name: "MIT International Science Internship", url: "https://misti.mit.edu/", description: "MIT International Science and Technology Initiatives global internships" },

  // ── Conferences and youth programs ───────────────────────────────────────
  { name: "World Youth Forum", url: "https://www.wyfegypt.com/", description: "Annual youth gathering in Egypt with full-funding tracks" },
  { name: "Youth Assembly", url: "https://www.youthassembly.us/", description: "Global youth assembly and summit at the United Nations" },
  { name: "Harvard Project for Asian and International Relations", url: "https://hpair.org/", description: "Harvard student-led conference series in Asia" },
  { name: "Yale-NUS Asia-Pacific YALI", url: "https://yali.yale.edu/", description: "Yale Young African Leaders Initiative summer institute" },
  { name: "Harvard MUN", url: "https://hmun.org/", description: "Harvard Model United Nations conference for high school students" },
  { name: "Johns Hopkins SAIS Programs", url: "https://sais.jhu.edu/programs", description: "SAIS academic and short-term programs in international studies" },
  { name: "Oxford Summer Courses", url: "https://www.oxfordsummercourses.com/", description: "Summer schools in Oxford colleges for ages 15+" },
  { name: "Yale Young African Scholars", url: "https://africanscholars.yale.edu/", description: "Two-week academic and enrichment programme for African high schoolers" },
  { name: "Stanford Pre-Collegiate Studies", url: "https://summerinstitutes.spcs.stanford.edu/", description: "Stanford summer programs for ages 8 through 12th grade" },

  // ── Travel / cultural exchange / language ────────────────────────────────
  { name: "Goethe-Institut Scholarships", url: "https://www.goethe.de/en/spr/spr/stip.html", description: "Goethe-Institut scholarships and language course grants" },
  { name: "Confucius Institute Scholarships", url: "https://en.cis.chinese.cn/", description: "Chinese government Mandarin and culture scholarships" },
  { name: "British Council Scholarships", url: "https://www.britishcouncil.org/study-uk/scholarships", description: "British Council scholarships and study-UK information" },
  { name: "Campus France", url: "https://www.campusfrance.org/en", description: "Promotion of French higher education and scholarships" },
  { name: "Study in Italy", url: "https://www.studyinitaly.esteri.it/en", description: "Italian Ministry portal for international students" },
  { name: "Study in Spain", url: "https://www.educacionyfp.gob.es/eu/educacion-eu/que-estudiar-eu/becas-estudiantes-extranjeros.html", description: "Spanish Ministry of Education scholarships portal" },
  { name: "Study in Sweden", url: "https://studyinsweden.se/scholarships/", description: "Sweden's official portal for international study and scholarships" },
  { name: "Study in Switzerland", url: "https://www.swissuniversities.ch/en/topics/study-in-switzerland", description: "Swiss universities and scholarship information" },

  // ── Region- and country-specific portals (Central Asia friendly) ─────────
  { name: "El-Yurt Umidi Foundation", url: "https://el-yurt.uz/", description: "Uzbekistan government foundation for Uzbeks studying abroad" },
  { name: "President's Scholarship of Uzbekistan", url: "https://en.uzgov.uz/", description: "Government of Uzbekistan official information portal" },
  { name: "Russian Government Scholarship", url: "https://education-in-russia.com/", description: "Russian government scholarship portal for international students" },
  { name: "Türkiye Scholarships", url: "https://www.turkiyeburslari.gov.tr/", description: "Turkish government fully-funded scholarship programme" },
  { name: "King Abdulaziz University Scholarships", url: "https://admission.kau.edu.sa/", description: "Saudi Arabia government scholarships for international students" },
  { name: "King Salman Scholarship", url: "https://moe.gov.sa/en/Pages/default.aspx", description: "Saudi Ministry of Education scholarship listings" },
  { name: "Israel Government Scholarships", url: "https://embassies.gov.il/MFA/AboutTheMinistry/IsraelinternationalCooperation/Scholarship/Pages/Scholarships.aspx", description: "MASHAV-administered scholarships for international students" },
  { name: "Indonesia KNB Scholarship", url: "https://knb.kemdikbud.go.id/", description: "Kemitraan Negara Berkembang scholarship for developing countries" },
  { name: "Brunei Darussalam Government Scholarship", url: "https://www.mfa.gov.bn/Pages/BDGS.aspx", description: "Brunei government scholarship for international students" },
  { name: "Thailand International Cooperation Agency", url: "https://www.tica-thaigov.mfa.go.th/", description: "Royal Thai government scholarships and training awards" },

  // ── Climate, sustainability, social impact ───────────────────────────────
  { name: "Climate Tracker Fellowships", url: "https://climatetracker.org/", description: "Climate journalism fellowships and reporting opportunities" },
  { name: "UN Climate Change Internships", url: "https://unfccc.int/about-us/employment/internship-programme", description: "UNFCCC internships in Bonn and online" },
  { name: "GreenJobs International", url: "https://www.greenjobs.com/", description: "Sustainability, energy, environment job and internship board" },
  { name: "Conservation International Internships", url: "https://www.conservation.org/about/work-with-us/internships", description: "Conservation International internship programme" },
  { name: "WWF Internships", url: "https://www.worldwildlife.org/about/careers", description: "World Wildlife Fund internship and fellowship listings" },
  { name: "Greenpeace Volunteer", url: "https://www.greenpeace.org/international/get-involved/", description: "Greenpeace volunteer and campaign opportunities" },

  // ── Health, women, equity ────────────────────────────────────────────────
  { name: "Women Deliver Young Leaders", url: "https://womendeliver.org/young-leaders-program/", description: "Three-year leadership development program for advocates of gender equality" },
  { name: "Vital Voices Fellowships", url: "https://www.vitalvoices.org/programs/", description: "Programs for women leaders globally" },
  { name: "TechWomen", url: "https://www.techwomen.org/", description: "US State Department mentorship program for women in STEM" },
  { name: "AnitaB.org Programs", url: "https://anitab.org/", description: "Programs and grants for women in technology" },

  // ── Entrepreneurship ──────────────────────────────────────────────────────
  { name: "Y Combinator Startup School", url: "https://www.startupschool.org/", description: "Free online program for early-stage founders" },
  { name: "Techstars Programs", url: "https://www.techstars.com/", description: "Mentorship-driven accelerator programs worldwide" },
  { name: "500 Global Programs", url: "https://500.co/programs", description: "500 Global accelerator and seed programs" },
  { name: "MEST Africa", url: "https://meltwater.org/", description: "Pan-African training program in software entrepreneurship" },
  { name: "Seedstars", url: "https://www.seedstars.com/", description: "Emerging-market startup competition and accelerator" },
  { name: "Hello Tomorrow", url: "https://hello-tomorrow.org/", description: "Global Challenge for deep-tech early-stage startups" },

  // ── Government/diplomacy programs ────────────────────────────────────────
  { name: "Schuman Traineeships (European Parliament)", url: "https://ep-stages.gestmax.eu/", description: "Paid traineeships at the European Parliament" },
  { name: "Blue Book Traineeships (EU Commission)", url: "https://traineeships.ec.europa.eu/", description: "Paid traineeships at the European Commission" },
  { name: "Council of Europe Internships", url: "https://www.coe.int/en/web/jobs/internships", description: "Council of Europe internship programme" },
  { name: "NATO Internship Programme", url: "https://www.nato.int/cps/en/natohq/recruit-hq-int.htm", description: "NATO HQ internships for graduate students" },
  { name: "OSCE Internships", url: "https://jobs.osce.org/internship", description: "Organization for Security and Co-operation in Europe internships" },
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
