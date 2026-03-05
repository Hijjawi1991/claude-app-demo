import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import CheckoutButton from "./CheckoutButton";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Perfect for trying out async video interviews.",
    features: [
      "1 active job",
      "10 candidates per month",
      "5 questions per interview",
      "7-day video storage",
      "Kanban candidate pipeline",
      "HireBee branding on interview page",
      "Email support",
    ],
    cta: "Get started free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    badge: "Most popular",
    price: "$49",
    period: "/mo",
    description: "For growing teams that hire regularly.",
    features: [
      "Unlimited active jobs",
      "Unlimited candidates",
      "5 questions per interview",
      "1-year video storage",
      "Kanban candidate pipeline",
      "Remove HireBee branding",
      "Custom intro & outro text",
      "Candidate rating & notes",
      "CSV export of candidates",
      "Priority email support",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organisations with advanced needs.",
    features: [
      "Everything in Pro",
      "Unlimited video storage",
      "Custom branding (logo & colours)",
      "Team accounts with role-based access",
      "SSO / SAML integration",
      "Dedicated account manager",
      "API access",
      "Custom SLA & onboarding",
      "Phone & email support",
    ],
    cta: "Contact sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero px-6 pb-8 pt-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Pricing
          </span>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-gray-500">
            Start for free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </section>

        {/* Plans */}
        <section className="px-6 pb-24 pt-12">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-sm ${
                  plan.highlighted
                    ? "border-brand-600 ring-2 ring-brand-600 bg-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Badge */}
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}

                {/* Plan name */}
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-lg text-gray-400">{plan.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-600">
                        &#10003;
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  {plan.name === "Pro" ? (
                    <CheckoutButton />
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      variant="outline"
                      asChild
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ teaser */}
        <section className="gradient-section px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
            <div className="mt-12 space-y-6 text-left">
              {[
                {
                  q: "Can I switch plans at any time?",
                  a: "Yes. Upgrade, downgrade, or cancel anytime from your Settings page. Changes take effect immediately.",
                },
                {
                  q: "What happens when my free plan limits are reached?",
                  a: "You\u2019ll be prompted to upgrade. Existing interviews stay accessible, but you won\u2019t be able to create new jobs until you upgrade or close an existing one.",
                },
                {
                  q: "Do candidates need to create an account?",
                  a: "No. Candidates access their interview via a unique link and record directly in the browser. No sign-up, no download.",
                },
                {
                  q: "How does the Enterprise plan work?",
                  a: "Contact us and we\u2019ll put together a custom plan based on your team size, volume, and requirements. Includes dedicated onboarding.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {faq.a}
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
