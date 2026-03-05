import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle2 } from "lucide-react";
import BillingButton from "./BillingButton";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, stripe_customer_id, email")
    .eq("id", user!.id)
    .single();

  const plan = profile?.subscription_status || "free";
  const isPro = plan === "pro";
  const email = profile?.email || user!.email || "";

  const freeFeatures = [
    "1 active job",
    "10 candidates per month",
    "7-day video storage",
  ];

  const proFeatures = [
    "Unlimited active jobs",
    "Unlimited candidates",
    "1-year video storage",
    "Remove HireBee branding",
    "Priority support",
  ];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Settings
      </h1>

      {/* Account */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <Label className="text-xs text-muted-foreground">Account</Label>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {email}
          </div>
        </CardContent>
      </Card>

      {/* Plan & Billing */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Plan &amp; Billing
            </Label>
            <Badge variant={isPro ? "default" : "secondary"}>
              {isPro ? "Pro" : "Free"}
            </Badge>
          </div>

          <ul className="space-y-2">
            {(isPro ? proFeatures : freeFeatures).map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {f}
              </li>
            ))}
          </ul>

          <div className="pt-2">
            {isPro ? (
              <BillingButton />
            ) : (
              <Button asChild>
                <Link href="/pricing">
                  Upgrade to Pro &mdash; $49/mo
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
