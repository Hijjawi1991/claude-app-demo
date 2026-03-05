"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    });

    if (res.ok) {
      setSubmitted(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero px-6 pb-8 pt-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Contact
          </span>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-4 max-w-md text-gray-500">
            Have a question, want a demo, or need help? We&apos;d love to hear
            from you.
          </p>
        </section>

        <section className="px-6 pb-24 pt-12">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
            {/* Form */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mint-100 text-2xl text-mint-600">
                    &#10003;
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    Message sent!
                  </h2>
                  <p className="mt-2 text-gray-500">
                    Thanks! We&apos;ll be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                      className="mt-1.5 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="mt-1.5 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="How can we help?"
                      className="mt-1.5 rounded-lg"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Send message
                  </Button>
                </form>
              )}
            </div>

            {/* Info cards */}
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">Email us</h3>
                <p className="mt-2 text-sm text-gray-500">
                  For general enquiries and support.
                </p>
                <p className="mt-3 text-sm font-medium text-brand-600">
                  hello@hirebee.io
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">Book a demo</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Want a walkthrough? We&apos;ll show you how HireBee works in
                  15 minutes.
                </p>
                <p className="mt-3 text-sm font-medium text-brand-600">
                  Schedule a call &rarr;
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">Enterprise</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Need SSO, custom branding, or a dedicated account manager?
                  Let&apos;s talk.
                </p>
                <p className="mt-3 text-sm font-medium text-brand-600">
                  sales@hirebee.io
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
