import { NextResponse } from "next/server";
import { fetchMikroTik } from "@/lib/mikrotik";

export async function GET() {
  try {
    const [resource, identity] = await Promise.all([
      fetchMikroTik("/system/resource"),
      fetchMikroTik("/system/identity"),
    ]);

    return NextResponse.json({
      identity: identity.name,
      uptime: resource.uptime,
      cpuLoad: resource["cpu-load"],
      version: resource.version,
      board: resource["board-name"],
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
