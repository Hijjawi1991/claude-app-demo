import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero px-6 pb-16 pt-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            About us
          </span>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Hiring should be simple
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            HireBee was built to fix one problem: scheduling interviews wastes
            everyone&apos;s time. We replaced it with async video — faster for
            employers, fairer for candidates.
          </p>
        </section>

        {/* Story */}
        <section className="px-6 py-24">
          <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                Our story
              </span>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Born from frustration
              </h2>
              <p className="mt-4 leading-relaxed text-gray-500">
                We spent years coordinating calendars, chasing availability, and
                sitting through repetitive first-round calls. Every phone screen
                felt like it could have been a 2-minute video.
              </p>
              <p className="mt-4 leading-relaxed text-gray-500">
                So we built HireBee — the tool we wished existed. Employers send
                a link. Candidates record when it suits them. Everyone saves
                time.
              </p>
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                Our mission
              </span>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Faster, fairer, less stressful
              </h2>
              <p className="mt-4 leading-relaxed text-gray-500">
                We believe hiring should work for both sides. Async video gives
                candidates the space to show who they really are — and gives
                employers the time to review thoughtfully, without pressure.
              </p>
              <p className="mt-4 leading-relaxed text-gray-500">
                No unnecessary features. No bloat. Just one thing done really
                well: helping great people get hired.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="gradient-section px-6 py-24">
          <div className="mx-auto max-w-5xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Our values
            </span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              What we stand for
            </h2>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                {
                  title: "Simplicity first",
                  desc: "Every feature does one thing. The code is easy to follow. The app is easy to use.",
                },
                {
                  title: "Respect everyone\u2019s time",
                  desc: "Async means no one waits around. Candidates record when they\u2019re ready. Employers review when they can.",
                },
                {
                  title: "Fairness by design",
                  desc: "Every candidate gets the same questions, the same time limit, and the same opportunity to shine.",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
