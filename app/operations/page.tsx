"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Wifi, ShieldAlert, CheckCircle2, Search, Clock } from "lucide-react"

export default function ITNSAPage() {
  const [leases, setLeases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLease, setSelectedLease] = useState<any>(null)

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const res = await fetch("/api/mikrotik/dhcp-leases")
        const data = await res.json()
        if (Array.isArray(data)) {
          setLeases(data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch DHCP leases:", error)
      }
    }

    fetchLeases()
    const interval = setInterval(fetchLeases, 5000)
    return () => clearInterval(interval)
  }, [])

  const activeCount = leases.filter(l => l.status === "bound").length
  const waitingCount = leases.filter(l => l.status === "waiting" || l.status === "offered").length
  const staticCount = leases.filter(l => l.dynamic === "false").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 tracking-tighter italic">STAGE 2: ITNSA INFRASTRUCTURE</h1>
          <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">DHCP Server Monitoring & Device Inventory</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs font-bold font-mono">
            IP SCAN
          </Button>
          <Button className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-xs font-bold font-mono">
            DHCP SETTINGS
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900/50 border-neutral-700 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500 tracking-wider font-bold">TOTAL LEASES</p>
              <p className="text-2xl font-bold text-white font-mono">{loading ? "..." : leases.length}</p>
            </div>
            <Laptop className="w-8 h-8 text-cyan-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-700 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500 tracking-wider font-bold">ACTIVE (BOUND)</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono">{loading ? "..." : activeCount}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-cyan-400 opacity-50" />
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-700 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500 tracking-wider font-bold">WAITING / OFFERED</p>
              <p className="text-2xl font-bold text-yellow-500 font-mono">{loading ? "..." : waitingCount}</p>
            </div>
            <Wifi className="w-8 h-8 text-yellow-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-700 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500 tracking-wider font-bold">STATIC ASSIGNMENTS</p>
              <p className="text-2xl font-bold text-purple-500 font-mono">{loading ? "..." : staticCount}</p>
            </div>
            <ShieldAlert className="w-8 h-8 text-purple-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Device List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-neutral-500 font-mono text-xs animate-pulse">
            COLLECTING DEVICE INVENTORY FROM MIKROTIK...
          </div>
        ) : leases.map((lease) => (
          <Card
            key={lease.id}
            className="bg-neutral-900/80 border-neutral-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group shadow-md"
            onClick={() => setSelectedLease(lease)}
          >
            <CardHeader className="pb-3 border-b border-neutral-800/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white tracking-wider group-hover:text-cyan-400 transition-colors">
                    {lease["host-name"] || "UNKNOWN DEVICE"}
                  </CardTitle>
                  <p className="text-[10px] text-neutral-500 font-mono tracking-tighter uppercase">{lease["mac-address"]}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${lease.status === "bound" ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-neutral-600"}`}></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex gap-2">
                <Badge className={lease.status === "bound" ? "bg-cyan-500/20 text-cyan-400 border-none text-[8px]" : "bg-neutral-800 text-neutral-500 border-none text-[8px]"}>
                  {lease.status.toUpperCase()}
                </Badge>
                <Badge className={lease.dynamic === "false" ? "bg-purple-500/20 text-purple-400 border-none text-[8px]" : "bg-neutral-800 text-neutral-400 border-none text-[8px]"}>
                  {lease.dynamic === "false" ? "STATIC" : "DYNAMIC"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                  <Activity className="w-3 h-3 text-cyan-500" />
                  <span>ADDRESS: <span className="text-white font-bold">{lease.address}</span></span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  <span>EXPIRES IN: <span className="text-neutral-300">{lease["expires-after"] || "INFINITY"}</span></span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/50 text-[9px] text-neutral-600 italic">
                SERVER: {lease.server}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Activity({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
