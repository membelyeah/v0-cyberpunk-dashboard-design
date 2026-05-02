import { NextResponse } from "next/server";
import { fetchMikroTik } from "@/lib/mikrotik";

export async function GET() {
  try {
    const filters = await fetchMikroTik("/ip/firewall/filter");
    return NextResponse.json(filters);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
