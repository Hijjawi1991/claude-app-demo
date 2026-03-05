import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  console.log("GET /api/admin/candidates/[candidateId] — start");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*, jobs!inner(owner_id)")
    .eq("id", params.candidateId)
    .single();

  if (!candidate || candidate.jobs.owner_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Get answers with signed URLs
  const { data: answers } = await supabase
    .from("candidate_answers")
    .select("*, job_questions(prompt_text, order_index)")
    .eq("candidate_id", candidate.id);

  // Generate signed URLs for videos
  const answersWithUrls = await Promise.all(
    (answers || []).map(async (answer) => {
      if (answer.video_path) {
        const { data } = await supabase.storage
          .from("interviews")
          .createSignedUrl(answer.video_path, 3600);
        return { ...answer, video_url: data?.signedUrl || null };
      }
      return answer;
    })
  );

  console.log("GET /api/admin/candidates/[candidateId] — done");
  return NextResponse.json({ candidate, answers: answersWithUrls });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  console.log("PATCH /api/admin/candidates/[candidateId] — start");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("candidates")
    .select("*, jobs!inner(owner_id)")
    .eq("id", params.candidateId)
    .single();

  if (!existing || existing.jobs.owner_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();

  const { data: candidate, error } = await supabase
    .from("candidates")
    .update(body)
    .eq("id", params.candidateId)
    .select()
    .single();

  if (error) {
    console.log("PATCH /api/admin/candidates/[candidateId] — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("PATCH /api/admin/candidates/[candidateId] — done");
  return NextResponse.json({ candidate });
}
