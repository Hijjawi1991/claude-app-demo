import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  console.log("POST /api/interview/[token]/complete — start");

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("candidates")
    .update({
      status: "Pending",
      completed_at: new Date().toISOString(),
    })
    .eq("invite_token", params.token);

  if (error) {
    console.log("POST /api/interview/[token]/complete — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("POST /api/interview/[token]/complete — done");
  return NextResponse.json({ success: true });
}
