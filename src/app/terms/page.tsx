import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 21, 2026
      </p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using InternGo (&quot;the Platform&quot;), you agree
            to be bound by these Terms of Use. If you do not agree with any part
            of these terms, you may not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p>
            InternGo is a web platform that aggregates and displays internship
            positions, scholarships, international programs, and other
            opportunities for students and youth. We collect listings from
            user submissions and automated AI-powered discovery from publicly
            available sources.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. User Accounts
          </h2>
          <p>
            To access certain features (saving listings, tracking applications),
            you must create an account. You are responsible for maintaining the
            confidentiality of your credentials and for all activity under your
            account. You must provide accurate information and be at least 16
            years old to create an account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. User-Submitted Content
          </h2>
          <p>
            Users and organizations may submit opportunity listings to the
            Platform. By submitting content, you represent that:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>The information is accurate and not misleading</li>
            <li>You have the right to share this information</li>
            <li>
              The listing does not violate any laws or third-party rights
            </li>
            <li>
              The opportunity is legitimate and not a scam or fraudulent scheme
            </li>
          </ul>
          <p className="mt-2">
            We reserve the right to review, edit, or remove any submitted
            content at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. AI-Scouted Content
          </h2>
          <p>
            Some listings on InternGo are discovered automatically by our
            AI-powered scouter from publicly available sources. While we strive
            for accuracy, we cannot guarantee that all AI-scouted information is
            complete, current, or error-free. Always verify details directly with
            the organizing body before applying.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Disclaimer
          </h2>
          <p>
            InternGo acts as an information aggregator. We do not endorse,
            guarantee, or take responsibility for the opportunities listed on
            the Platform. We are not a party to any application process or
            agreement between you and the organizations listed. The Platform is
            provided &quot;as is&quot; without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Prohibited Use
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Post false, misleading, or fraudulent listings</li>
            <li>Scrape or harvest data from the Platform without permission</li>
            <li>
              Use the Platform for any unlawful purpose or to solicit illegal
              activity
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the Platform
            </li>
            <li>Interfere with the proper functioning of the Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            8. Intellectual Property
          </h2>
          <p>
            The InternGo name, logo, design, and original content are the
            property of InternGo. Third-party listings and organization names
            remain the property of their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. Limitation of Liability
          </h2>
          <p>
            InternGo shall not be liable for any direct, indirect, incidental,
            or consequential damages arising from your use of the Platform,
            including but not limited to losses resulting from reliance on
            listing information, application outcomes, or service interruptions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            10. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes
            become effective upon posting. Continued use of the Platform after
            changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            11. Contact
          </h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:legal@interngo.uz"
              className="text-primary hover:underline"
            >
              legal@interngo.uz
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
