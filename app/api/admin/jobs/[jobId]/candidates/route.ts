import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  console.log("GET /api/admin/jobs/[jobId]/candidates — start");

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

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("job_id", params.jobId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("GET /api/admin/jobs/[jobId]/candidates — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("GET /api/admin/jobs/[jobId]/candidates — done");
  return NextResponse.json({ candidates });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  console.log("POST /api/admin/jobs/[jobId]/candidates — start");

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

  const { full_name, email } = await req.json();
  const invite_token = randomUUID();

  // Use admin client for insert to bypass RLS (ownership already verified above)
  const admin = createAdminClient();
  const { data: candidate, error } = await admin
    .from("candidates")
    .insert({
      job_id: params.jobId,
      full_name,
      email,
      invite_token,
      status: "Pending",
    })
    .select()
    .single();

  if (error) {
    console.log("POST /api/admin/jobs/[jobId]/candidates — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("POST /api/admin/jobs/[jobId]/candidates — done");
  return NextResponse.json({ candidate, invite_token });
}
