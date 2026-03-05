import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  console.log("GET /api/interview/[token] — start");

  const supabase = createAdminClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*, jobs(title, description, max_answer_seconds, prep_time_seconds)")
    .eq("invite_token", params.token)
    .single();

  if (!candidate) {
    return NextResponse.json(
      { error: "Invalid interview link" },
      { status: 404 }
    );
  }

  // Already completed
  if (candidate.completed_at) {
    return NextResponse.json(
      { error: "This interview has already been completed" },
      { status: 410 }
    );
  }

  // Check if job is still active
  const { data: job } = await supabase
    .from("jobs")
    .select("is_active, max_do_overs")
    .eq("id", candidate.job_id)
    .single();

  if (!job?.is_active) {
    return NextResponse.json(
      { error: "This job is no longer accepting interviews" },
      { status: 410 }
    );
  }

  const { data: questions } = await supabase
    .from("job_questions")
    .select("id, prompt_text, order_index")
    .eq("job_id", candidate.job_id)
    .order("order_index");

  console.log("GET /api/interview/[token] — done");
  return NextResponse.json({
    job: { ...candidate.jobs, max_do_overs: job.max_do_overs },
    questions,
    candidate: { id: candidate.id, full_name: candidate.full_name },
  });
}
