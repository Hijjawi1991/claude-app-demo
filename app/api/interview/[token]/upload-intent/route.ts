import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  console.log("POST /api/interview/[token]/upload-intent — start");

  const supabase = createAdminClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("id, job_id")
    .eq("invite_token", params.token)
    .single();

  if (!candidate) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const { orderIndex } = await req.json();

  const path = `jobs/${candidate.job_id}/candidates/${candidate.id}/q${orderIndex}.webm`;

  const { data, error } = await supabase.storage
    .from("interviews")
    .createSignedUploadUrl(path);

  if (error) {
    console.log("POST /api/interview/[token]/upload-intent — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("POST /api/interview/[token]/upload-intent — done");
  return NextResponse.json({ signedUrl: data.signedUrl, path });
}
