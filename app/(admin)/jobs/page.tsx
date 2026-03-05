import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function JobsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, candidates(count)")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <Button asChild>
          <Link href="/jobs/new">Create job</Link>
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {jobs?.length === 0 && (
          <p className="text-sm text-gray-500">
            No jobs yet. Create your first one to get started.
          </p>
        )}
        {jobs?.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {job.candidates?.[0]?.count || 0} candidates
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  job.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {job.is_active ? "Active" : "Closed"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
