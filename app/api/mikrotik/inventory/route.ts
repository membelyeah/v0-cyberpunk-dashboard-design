import { NextResponse } from "next/server";
import { fetchMikroTik } from "@/lib/mikrotik";

export async function GET() {
  try {
    const [arp, dhcp, interfaces] = await Promise.all([
      fetchMikroTik("/ip/arp"),
      fetchMikroTik("/ip/dhcp-server/lease"),
      fetchMikroTik("/interface"),
    ]);

    return NextResponse.json({
      arpCount: arp.length,
      dhcpCount: dhcp.length,
      interfaceCount: interfaces.length,
      interfaces: interfaces.map((i: any) => ({ name: i.name, status: i.running })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
