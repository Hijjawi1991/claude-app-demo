import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  console.log("POST /api/interview/[token]/submit — start");

  const supabase = createAdminClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("id")
    .eq("invite_token", params.token)
    .single();

  if (!candidate) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const { questionId, videoPath, videoUrl, durationSeconds, doOversUsed } =
    await req.json();

  // Upsert so re-records overwrite previous answer
  const { error } = await supabase.from("candidate_answers").upsert(
    {
      candidate_id: candidate.id,
      job_question_id: questionId,
      video_path: videoPath,
      video_url: videoUrl || videoPath,
      duration_seconds: durationSeconds,
      do_overs_used: doOversUsed || 0,
    },
    { onConflict: "candidate_id,job_question_id" }
  );

  if (error) {
    console.log("POST /api/interview/[token]/submit — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("POST /api/interview/[token]/submit — done");
  return NextResponse.json({ success: true });
}
