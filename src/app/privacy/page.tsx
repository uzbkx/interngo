import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground mb-6">
        Last updated: March 21, 2026
      </p>

      <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Introduction
          </h2>
          <p>
            InternGo (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects
            your privacy. This Privacy Policy explains how we collect, use, and
            protect your personal information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Information We Collect
          </h2>
          <h3 className="text-base font-medium text-foreground mt-3">
            Information you provide:
          </h3>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              Account information (name, email address) when you register
            </li>
            <li>Profile data you choose to add (bio, avatar)</li>
            <li>Listings you submit to the platform</li>
            <li>
              Application tracking data (which opportunities you save or track)
            </li>
            <li>Notes you add to tracked applications</li>
          </ul>

          <h3 className="text-base font-medium text-foreground mt-3">
            Information collected automatically:
          </h3>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              Browser type, device information, and operating system
            </li>
            <li>Pages visited and time spent on the platform</li>
            <li>Language preference</li>
            <li>IP address (for security and analytics purposes)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Provide and maintain the platform</li>
            <li>
              Enable features like saving listings and tracking applications
            </li>
            <li>Send important account-related notifications</li>
            <li>Improve the platform based on usage patterns</li>
            <li>Prevent fraud and ensure platform security</li>
            <li>Display your language preference across sessions</li>
          </ul>
          <p className="mt-2">
            We do <strong className="text-foreground">not</strong> sell, rent, or
            share your personal data with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Data Storage & Security
          </h2>
          <p>
            Your data is stored securely using industry-standard encryption. We
            use PostgreSQL databases with encrypted connections. Passwords are
            hashed and never stored in plain text. We implement appropriate
            technical and organizational measures to protect against unauthorized
            access, alteration, or destruction of data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Cookies
          </h2>
          <p>We use minimal cookies for:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              <strong className="text-foreground">Authentication:</strong>{" "}
              Keeping you logged in across sessions
            </li>
            <li>
              <strong className="text-foreground">Language preference:</strong>{" "}
              Remembering your selected language (English, O&apos;zbek, or
              Russian)
            </li>
          </ul>
          <p className="mt-2">
            We do not use tracking cookies or third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Third-Party Services
          </h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              <strong className="text-foreground">Supabase:</strong>{" "}
              Authentication and database hosting
            </li>
            <li>
              <strong className="text-foreground">Vercel:</strong> Platform
              hosting
            </li>
            <li>
              <strong className="text-foreground">Google OAuth:</strong> Optional
              sign-in method (only basic profile info is accessed)
            </li>
          </ul>
          <p className="mt-2">
            These services have their own privacy policies governing how they
            handle your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Your Rights
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              <strong className="text-foreground">Access</strong> your personal
              data
            </li>
            <li>
              <strong className="text-foreground">Correct</strong> inaccurate
              data
            </li>
            <li>
              <strong className="text-foreground">Delete</strong> your account
              and associated data
            </li>
            <li>
              <strong className="text-foreground">Export</strong> your data in a
              portable format
            </li>
            <li>
              <strong className="text-foreground">Withdraw consent</strong> for
              optional data processing at any time
            </li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:privacy@interngo.uz"
              className="text-primary hover:underline"
            >
              privacy@interngo.uz
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            8. Children&apos;s Privacy
          </h2>
          <p>
            InternGo is intended for users aged 16 and above. We do not
            knowingly collect information from children under 16. If you believe
            a child has provided us with personal data, please contact us and we
            will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. Data Retention
          </h2>
          <p>
            We retain your account data for as long as your account is active.
            If you delete your account, we will remove your personal data within
            30 days, except where retention is required by law. Anonymized usage
            data may be retained for analytics purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            registered users of significant changes via email. The &quot;Last
            updated&quot; date at the top reflects the most recent revision.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            11. Contact Us
          </h2>
          <p>
            For privacy-related questions or requests, contact us at{" "}
            <a
              href="mailto:privacy@interngo.uz"
              className="text-primary hover:underline"
            >
              privacy@interngo.uz
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
