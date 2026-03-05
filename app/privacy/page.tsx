import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero px-6 pb-8 pt-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Legal
          </span>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-md text-gray-500">
            Last updated: 5 March 2026
          </p>
        </section>

        <section className="px-6 pb-24 pt-12">
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                1. Information we collect
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                We collect information you provide directly, such as your name,
                email address, and company name when you create an account. When
                candidates record video interviews, we store the video files
                securely on your behalf.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                2. How we use your information
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                We use your information to provide and improve our services,
                process transactions, send service-related communications, and
                respond to your requests. Video recordings are only accessible to
                the employer who created the job and are never shared with third
                parties.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                3. Data storage and security
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                All data is stored securely using industry-standard encryption.
                Video files are stored with signed URLs and are never publicly
                accessible. We use Supabase for our database and storage
                infrastructure, which provides enterprise-grade security.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                4. Data retention
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                Video recordings are retained based on your plan: 7 days on the
                Free plan, 1 year on Pro, and unlimited on Enterprise. Account
                data is retained for as long as your account is active. You can
                request deletion of your data at any time by contacting us.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                5. Candidate data
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                Candidates do not need to create an account. We collect their
                name, email, and video recordings only for the purpose of the
                interview. Candidates can request deletion of their data by
                contacting the employer or by emailing us directly.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                6. Cookies
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                We use essential cookies to keep you logged in and maintain your
                session. We do not use tracking or advertising cookies.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                7. Your rights
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                You have the right to access, correct, or delete your personal
                data. You can also request a copy of all data we hold about you.
                To exercise any of these rights, contact us at
                privacy@hirebee.io.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                8. Contact
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                If you have any questions about this privacy policy, please
                contact us at privacy@hirebee.io.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
