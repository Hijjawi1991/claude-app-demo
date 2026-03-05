import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KanbanBoard from "./KanbanBoard";

export default async function PipelinePage({
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
    .select("id, title")
    .eq("id", params.jobId)
    .eq("owner_id", user!.id)
    .single();

  if (!job) {
    notFound();
  }

  const { data: candidates } = await supabase
    .from("candidates")
    .select("id, full_name, email, status, invite_token, completed_at")
    .eq("job_id", job.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl">
      <KanbanBoard
        jobId={job.id}
        jobTitle={job.title}
        initialCandidates={candidates || []}
      />
    </div>
  );
}
