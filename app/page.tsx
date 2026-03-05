import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero px-6 pb-24 pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              Trusted by 500+ hiring teams
            </span>

            <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              The most cost-effective way to{" "}
              <span className="text-brand-600">screen candidates</span> at
              scale.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
              Traditional hiring practices are time-consuming. Reduce your
              hiring overhead with async video interviews. No scheduling, no
              back-and-forth.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">Get started free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Book a demo</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Get started in less than 10 minutes today
            </p>
          </div>

          {/* Floating social proof pills */}
          <div className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-mint-200 bg-mint-50 px-4 py-1.5 text-sm font-medium text-mint-600">
              &#10003; 98% Accuracy
            </span>
            <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600">
              &#10003; No candidate account needed
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600">
              &#10003; Browser-based recording
            </span>
            <span className="rounded-full border border-mint-200 bg-mint-50 px-4 py-1.5 text-sm font-medium text-mint-600">
              &#10003; GDPR Compliant
            </span>
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                How it works
              </span>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Three steps to better hiring
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-500">
                Set up your first interview in minutes. Candidates record on
                their own time. You review when it suits you.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-xl font-bold text-brand-600">
                  1
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Create a job
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Add your job title, description, and up to 5 video interview
                  questions. Set time limits and prep time for candidates.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-xl font-bold text-brand-600">
                  2
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Invite candidates
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Share a unique link. Candidates record answers directly in
                  their browser — no account, no download, no friction.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-xl font-bold text-brand-600">
                  3
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Review &amp; decide
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Watch responses, rate candidates, leave notes, and drag them
                  through your Kanban pipeline. Hire the best, faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="gradient-section px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                Features
              </span>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Everything you need to hire async
              </h2>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Kanban pipeline",
                  desc: "Drag candidates through stages — Pending, Shortlisted, Approved, Rejected. Stay organised at a glance.",
                },
                {
                  title: "One-way video interviews",
                  desc: "Candidates record answers on their own schedule. No calendar coordination needed.",
                },
                {
                  title: "Unique invite links",
                  desc: "Generate a secure, tokenised link for each candidate. No sign-up required on their end.",
                },
                {
                  title: "Candidate rating & notes",
                  desc: "Rate responses 1-5 and leave private notes. Compare candidates side by side.",
                },
                {
                  title: "Custom questions",
                  desc: "Write up to 5 questions per job. Set recording time limits and thinking time.",
                },
                {
                  title: "Secure video storage",
                  desc: "All videos stored privately with signed URLs. No public access, ever.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof / stats */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl bg-brand-600 px-8 py-16 text-center text-white sm:px-16">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Trusted by growing teams worldwide
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-brand-100">
                Companies using HireBee reduce their screening time by 80% and
                improve candidate experience scores.
              </p>

              <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
                <div>
                  <p className="text-4xl font-bold">500+</p>
                  <p className="mt-1 text-sm text-brand-200">Companies</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">50k+</p>
                  <p className="mt-1 text-sm text-brand-200">
                    Interviews completed
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold">80%</p>
                  <p className="mt-1 text-sm text-brand-200">
                    Faster screening
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold">4.9/5</p>
                  <p className="mt-1 text-sm text-brand-200">
                    Candidate rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
