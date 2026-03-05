import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JobDetailTabs from "./job-detail-tabs";

export default async function JobDetailPage({
  params,
}: {
  params: { jobId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", params.jobId)
    .eq("owner_id", user!.id)
    .single();

  if (!job) {
    notFound();
  }

  const { data: questions } = await supabase
    .from("job_questions")
    .select("*")
    .eq("job_id", job.id)
    .order("order_index");

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .eq("job_id", job.id)
    .order("created_at", { ascending: false });

  return (
    <JobDetailTabs
      job={job}
      questions={questions || []}
      candidates={candidates || []}
    />
  );
}
