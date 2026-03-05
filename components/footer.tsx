import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* CTA band */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to hire smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-brand-200">
            Get started in less than 10 minutes. No credit card required.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50"
              asChild
            >
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Book a demo</Link>
            </Button>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid gap-8 border-t border-brand-800 pt-12 sm:grid-cols-4">
          <div>
            <p className="text-lg font-bold">HireBee</p>
            <p className="mt-2 text-sm text-brand-300">
              The most cost-effective way to screen candidates at scale.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
              Product
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              <Link href="/pricing" className="text-sm text-brand-200 hover:text-white">
                Pricing
              </Link>
              <Link href="/signup" className="text-sm text-brand-200 hover:text-white">
                Get started
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
              Company
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              <Link href="/about" className="text-sm text-brand-200 hover:text-white">
                About
              </Link>
              <Link href="/contact" className="text-sm text-brand-200 hover:text-white">
                Contact
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
              Legal
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              <Link href="/privacy" className="text-sm text-brand-200 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-brand-200 hover:text-white">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-800 pt-8 text-center text-sm text-brand-400">
          &copy; {new Date().getFullYear()} HireBee. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
