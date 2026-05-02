import { NextResponse } from "next/server";
import { fetchMikroTik } from "@/lib/mikrotik";

export async function POST(request: Request) {
  try {
    const { ip, comment } = await request.json();

    if (!ip) {
      return NextResponse.json({ error: "IP Address is required" }, { status: 400 });
    }

    // Add IP to address-list "Blacklist"
    const result = await fetchMikroTik("/ip/firewall/address-list", {
      method: "PUT",
      body: JSON.stringify({
        list: "Blacklist",
        address: ip,
        comment: comment || "Added from Lienka WAF Dashboard",
      }),
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Blacklist Add Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
