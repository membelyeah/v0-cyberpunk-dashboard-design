import { NextResponse } from "next/server";
import { fetchMikroTik } from "@/lib/mikrotik";

export async function GET() {
  try {
    const [interfaces, dhcp, ppp, firewall] = await Promise.all([
      fetchMikroTik("/interface"),
      fetchMikroTik("/ip/dhcp-server/lease"),
      fetchMikroTik("/ppp/secret").catch(() => []), // Catch if PPP is not used
      fetchMikroTik("/ip/firewall/filter"),
    ]);

    // Mapping logic to the 4 Stages
    const stages = {
      // Stage 1: Cabling (Physical Links)
      stage1: interfaces.filter((i: any) => i.running === "true").length,
      
      // Stage 2: ITNSA (Connected Clients)
      stage2: dhcp.length,
      
      // Stage 3: Cloud (Tunnels/Secrets)
      stage3: ppp.length,
      
      // Stage 4: Cyber Sec (Security Rules)
      stage4: firewall.length,
      
      total: interfaces.length + dhcp.length + ppp.length + firewall.length,
    };

    return NextResponse.json({ stages });
  } catch (error: any) {
    console.error("Logic API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
