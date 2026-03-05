import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("POST /api/contact — start");

  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;

  if (!airtableToken || !airtableBaseId) {
    console.log("POST /api/contact — error: missing Airtable credentials");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${airtableBaseId}/Contact%20Form`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: name,
              Email: email,
              Message: message,
              "Submitted At": new Date().toISOString(),
            },
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.log("POST /api/contact — Airtable error:", errorData);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }

  console.log("POST /api/contact — done");
  return NextResponse.json({ success: true });
}
