import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  console.log("GET /api/admin/jobs — start");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("GET /api/admin/jobs — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("GET /api/admin/jobs — done");
  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  console.log("POST /api/admin/jobs — start");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check plan limits
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  if (profile?.subscription_status === "free" || !profile?.subscription_status) {
    const { count } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", user.id)
      .eq("is_active", true);

    if ((count || 0) >= 1) {
      return NextResponse.json(
        { error: "Free plan allows 1 active job. Upgrade to Pro for unlimited jobs." },
        { status: 403 }
      );
    }
  }

  const { title, description } = await req.json();

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({ owner_id: user.id, title, description })
    .select()
    .single();

  if (error) {
    console.log("POST /api/admin/jobs — error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("POST /api/admin/jobs — done");
  return NextResponse.json({ job });
}
