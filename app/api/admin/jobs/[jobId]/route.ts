import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  console.log("PATCH /api/admin/jobs/[jobId] — start");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data: job, error } = await supabase
    .from("jobs")
    .update(body)
    .eq("id", params.jobId)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) {
    console.log("PATCH /api/admin/jobs/[jobId] — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("PATCH /api/admin/jobs/[jobId] — done");
  return NextResponse.json({ job });
}
