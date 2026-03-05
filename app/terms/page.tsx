import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mx-auto mt-4 max-w-md text-gray-500">
            Last updated: 5 March 2026
          </p>
        </section>

        <section className="px-6 pb-24 pt-12">
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                1. Acceptance of terms
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                By accessing or using HireBee, you agree to be bound by these
                terms. If you do not agree, you may not use the service. These
                terms apply to all users, including employers and candidates.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                2. Description of service
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                HireBee is an async video interview platform. Employers create
                jobs, set interview questions, and invite candidates via unique
                links. Candidates record video responses in their browser. All
                recordings are stored securely and accessible only to the
                employer.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                3. Accounts
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                Employers must create an account to use HireBee. You are
                responsible for maintaining the security of your account and
                password. Candidates do not need an account — they access
                interviews via a unique link.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                4. Acceptable use
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                You agree not to misuse the service. This includes but is not
                limited to: sharing candidate videos without consent,
                using the platform for purposes other than hiring, attempting to
                access other users&apos; data, or reverse-engineering the platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                5. Plans and billing
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                HireBee offers Free, Pro, and Enterprise plans. Paid plans are
                billed monthly. You can upgrade, downgrade, or cancel at any
                time. Cancellation takes effect at the end of the current billing
                period. No refunds are provided for partial months.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                6. Content ownership
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                Employers retain ownership of all job content and interview
                questions. Candidates retain ownership of their video recordings.
                By using HireBee, you grant us a limited licence to store and
                deliver this content as part of the service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                7. Limitation of liability
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                HireBee is provided &quot;as is&quot; without warranties of any kind. We
                are not liable for any indirect, incidental, or consequential
                damages arising from your use of the service. Our total liability
                is limited to the amount you paid us in the 12 months prior to
                the claim.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                8. Changes to terms
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                We may update these terms from time to time. We will notify you
                of material changes via email or through the platform. Continued
                use of the service after changes constitutes acceptance of the
                new terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                9. Contact
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500">
                If you have any questions about these terms, please contact us at
                legal@hirebee.io.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
