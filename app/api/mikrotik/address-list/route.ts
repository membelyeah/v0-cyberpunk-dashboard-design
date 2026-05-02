import { NextResponse } from "next/server";
import { fetchMikroTik } from "@/lib/mikrotik";

export async function GET() {
  try {
    const addressList = await fetchMikroTik("/ip/firewall/address-list");

    // Process lists to get counts for stages
    // We assume lists are named Stage 1, Stage 2, etc. or similar
    const stages = {
      stage1: addressList.filter((item: any) => item.list.toLowerCase().includes("stage 1")).length,
      stage2: addressList.filter((item: any) => item.list.toLowerCase().includes("stage 2")).length,
      stage3: addressList.filter((item: any) => item.list.toLowerCase().includes("stage 3")).length,
      stage4: addressList.filter((item: any) => item.list.toLowerCase().includes("stage 4") || item.list.toLowerCase().includes("blacklist")).length,
      total: addressList.length,
    };

    return NextResponse.json({ stages, raw: addressList.slice(0, 50) }); // Limit raw for performance
  } catch (error: any) {
    console.error("Address List API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
