import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  console.log("PUT /api/admin/jobs/[jobId]/questions — start");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify job ownership
  const { data: job } = await supabase
    .from("jobs")
    .select("id")
    .eq("id", params.jobId)
    .eq("owner_id", user.id)
    .single();

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const { questions } = await req.json();

  if (!questions || questions.length > 5) {
    return NextResponse.json(
      { error: "Provide 1-5 questions" },
      { status: 400 }
    );
  }

  // Delete existing questions and replace
  await supabase.from("job_questions").delete().eq("job_id", params.jobId);

  const rows = questions.map((q: string, i: number) => ({
    job_id: params.jobId,
    prompt_text: q,
    order_index: i + 1,
  }));

  const { error } = await supabase.from("job_questions").insert(rows);

  if (error) {
    console.log("PUT /api/admin/jobs/[jobId]/questions — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("PUT /api/admin/jobs/[jobId]/questions — done");
  return NextResponse.json({ success: true });
}
