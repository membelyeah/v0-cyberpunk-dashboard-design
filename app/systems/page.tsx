"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, Flame, Bug, Lock, HardDrive, Terminal } from "lucide-react"

export default function CyberSecPage() {
  const [filters, setFilters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/mikrotik/firewall-filters")
        const data = await res.json()
        if (Array.isArray(data)) {
          setFilters(data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch firewall filters:", error)
      }
    }

    fetchFilters()
    const interval = setInterval(fetchFilters, 5000)
    return () => clearInterval(interval)
  }, [])

  const dropCount = filters.filter(f => f.action === "drop").length
  const acceptCount = filters.filter(f => f.action === "accept").length
  const totalPackets = filters.reduce((acc, f) => acc + (parseInt(f.packets) || 0), 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 tracking-tighter italic">STAGE 4: CYBER SECURITY OPS</h1>
          <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">Firewall Filtering & Threat Deflection Layer</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 text-xs font-bold font-mono">
            EMERGENCY LOCKDOWN
          </Button>
          <Button className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs font-bold font-mono">
            SECURITY LOGS
          </Button>
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 tracking-wider font-bold">DROP RULES</p>
                <p className="text-2xl font-bold text-white font-mono">{loading ? "..." : dropCount}</p>
              </div>
              <Flame className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-cyan-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 tracking-wider font-bold">ACCEPT RULES</p>
                <p className="text-2xl font-bold text-white font-mono">{loading ? "..." : acceptCount}</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-cyan-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4 text-center">
            <p className="text-[10px] text-neutral-500 tracking-wider font-bold mb-1 uppercase">Total Packets Filtered</p>
            <p className="text-xl font-bold text-cyan-400 font-mono tracking-tighter">
              {loading ? "..." : totalPackets.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4 text-center text-cyan-400">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-neutral-500">Node Threat Status</div>
            <div className="text-sm font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              SECURE
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Firewall Rules Table */}
      <Card className="bg-neutral-900/90 border-neutral-700 backdrop-blur-md">
        <CardHeader className="bg-neutral-950/50 border-b border-neutral-800">
          <CardTitle className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            LIVE FILTER ENGINE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">ACTION</th>
                  <th className="px-6 py-4">CHAIN</th>
                  <th className="px-6 py-4">SRC / DST</th>
                  <th className="px-6 py-4">PACKETS / BYTES</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono text-[10px]">
                {loading ? (
                  <tr><td colSpan={6} className="py-20 text-center animate-pulse">ANALYZING FIREWALL LOGS...</td></tr>
                ) : filters.map((rule, index) => (
                  <tr key={rule.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 text-neutral-500">[{index}]</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold uppercase ${rule.action === "drop" ? "text-red-500" : rule.action === "accept" ? "text-green-500" : "text-yellow-500"}`}>
                        {rule.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white uppercase">{rule.chain}</td>
                    <td className="px-6 py-4">
                      <div className="text-neutral-400">SRC: {rule["src-address"] || "any"}</div>
                      <div className="text-neutral-400">DST: {rule["dst-address"] || "any"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{rule.packets} pkts</div>
                      <div className="text-neutral-500">{(parseInt(rule.bytes) / 1024).toFixed(1)} KB</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={rule.disabled === "false" ? "text-cyan-400" : "text-neutral-600"}>
                        {rule.disabled === "false" ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
