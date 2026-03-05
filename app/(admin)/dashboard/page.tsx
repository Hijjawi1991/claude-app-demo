import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ChevronRight, Plus, Sparkles } from "lucide-react";
import NewJobButton from "./new-job-button";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: jobs }, { data: profile }] = await Promise.all([
    supabase
      .from("jobs")
      .select("*")
      .eq("owner_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user!.id)
      .single(),
  ]);

  const plan = profile?.subscription_status || "free";
  const isPro = plan === "pro";
  const jobList = jobs || [];
  const activeCount = jobList.filter((j) => j.is_active).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Jobs
          </h1>
          <Badge variant={isPro ? "default" : "secondary"}>
            {isPro ? "Pro" : "Free plan"}
          </Badge>
        </div>
        <NewJobButton isPro={isPro} jobCount={jobList.length} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
              <Briefcase className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total jobs</p>
              <p className="text-2xl font-bold">{jobList.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job list */}
      {jobList.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No jobs yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first job to start interviewing candidates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {jobList.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
                    <Briefcase className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={job.is_active ? "success" : "secondary"}>
                    {job.is_active ? "Active" : "Closed"}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Upgrade banner */}
      {!isPro && jobList.length >= 1 && (
        <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-brand-100/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-900">
                Upgrade to Pro
              </p>
              <p className="text-sm text-brand-700">
                Unlock unlimited jobs and candidates.
              </p>
            </div>
            <Link
              href="/pricing"
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Upgrade &mdash; $49/mo
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
