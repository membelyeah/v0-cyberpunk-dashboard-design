import { NextResponse } from "next/server";
import { fetchMikroTik } from "@/lib/mikrotik";

export async function POST(request: Request) {
  try {
    const { id, disabled } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Interface ID is required" }, { status: 400 });
    }

    // MikroTik REST API PATCH for updates
    const result = await fetchMikroTik(`/interface/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        disabled: disabled ? "true" : "false",
      }),
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Toggle Interface Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
