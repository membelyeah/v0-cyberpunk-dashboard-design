"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Wifi, ShieldAlert, CheckCircle2, Search, Clock, LayoutGrid, List } from "lucide-react"

export default function ITNSAPage() {
  const [leases, setLeases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLease, setSelectedLease] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showOnlyActive, setShowOnlyActive] = useState(false)

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

  const filteredLeases = showOnlyActive ? (leases || []).filter(l => l?.status === "bound") : (leases || [])
  const activeCount = leases.filter(l => l.status === "bound").length
  const waitingCount = leases.filter(l => l.status === "waiting" || l.status === "offered").length
  const staticCount = leases.filter(l => l.dynamic === "false").length

  const handleBlacklist = async (ip: string, hostname: string) => {
    if (!confirm(`Are you sure you want to BLACKLIST ${hostname} (${ip})?`)) return
    
    try {
      const res = await fetch("/api/mikrotik/blacklist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, comment: `Banned: ${hostname}` })
      })
      if (res.ok) {
        alert(`${hostname} has been added to Stage 4 (Cyber Sec) Blacklist.`)
      }
    } catch (error) {
      console.error("Failed to blacklist device:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 tracking-tighter italic">STAGE 2: ITNSA INFRASTRUCTURE</h1>
          <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">DHCP Server Monitoring & Device Inventory</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-neutral-900 border border-neutral-700 rounded p-1 mr-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode("grid")}
              className={`h-7 px-2 ${viewMode === "grid" ? "bg-cyan-500/20 text-cyan-400" : "text-neutral-500"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode("list")}
              className={`h-7 px-2 ${viewMode === "list" ? "bg-cyan-500/20 text-cyan-400" : "text-neutral-500"}`}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowOnlyActive(!showOnlyActive)}
            className={`h-9 px-3 border border-neutral-700 text-[10px] font-bold font-mono gap-2 transition-all ${showOnlyActive ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50" : "bg-neutral-900 text-neutral-500"}`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${showOnlyActive ? "text-cyan-400" : "text-neutral-600"}`} />
            {showOnlyActive ? "ACTIVE ONLY" : "SHOW ALL"}
          </Button>
          <Button className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs font-bold font-mono h-9">
            IP SCAN
          </Button>
          <Button className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-xs font-bold font-mono h-9">
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

      {/* Device List Grid / Table */}
      {loading ? (
        <div className="py-20 text-center text-neutral-500 font-mono text-xs animate-pulse">
          COLLECTING DEVICE INVENTORY FROM MIKROTIK...
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeases.filter(Boolean).map((lease) => (
            <Card
              key={lease[".id"]}
              className="bg-neutral-900/80 border-neutral-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group shadow-md"
              onClick={() => setSelectedLease(lease)}
            >
              <CardHeader className="pb-3 border-b border-neutral-800/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-white tracking-wider group-hover:text-cyan-400 transition-colors">
                      {lease?.["host-name"] || "UNKNOWN DEVICE"}
                    </CardTitle>
                    <p className="text-[10px] text-neutral-500 font-mono tracking-tighter uppercase">{lease?.["mac-address"] || "NO-MAC"}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${lease?.status === "bound" ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-neutral-600"}`}></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex gap-2">
                  <Badge className={lease?.status === "bound" ? "bg-cyan-500/20 text-cyan-400 border-none text-[8px]" : "bg-neutral-800 text-neutral-500 border-none text-[8px]"}>
                    {lease?.status?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                  <Badge className={lease?.dynamic === "false" ? "bg-purple-500/20 text-purple-400 border-none text-[8px]" : "bg-neutral-800 text-neutral-400 border-none text-[8px]"}>
                    {lease?.dynamic === "false" ? "STATIC" : "DYNAMIC"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                    <Activity className="w-3 h-3 text-cyan-500" />
                    <span>ADDRESS: <span className="text-white font-bold">{lease?.address || "N/A"}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>EXPIRES IN: <span className="text-neutral-300">{lease?.["expires-after"] || "INFINITY"}</span></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/50 flex justify-between items-center">
                  <span className="text-[9px] text-neutral-600 italic">SERVER: {lease?.server || "N/A"}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlacklist(lease?.address, lease?.["host-name"] || lease?.["mac-address"] || "unknown");
                    }}
                    className="h-6 px-2 text-[8px] font-bold text-red-500 hover:bg-red-500/10 hover:text-red-400 gap-1 border border-red-500/20"
                  >
                    <ShieldAlert className="w-2.5 h-2.5" />
                    BAN IP
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-neutral-900/80 border-neutral-700 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-950/50 text-[10px] text-neutral-500 uppercase font-bold tracking-widest border-b border-neutral-800">
                  <th className="px-6 py-4">HOSTNAME</th>
                  <th className="px-6 py-4">IP ADDRESS</th>
                  <th className="px-6 py-4">MAC ADDRESS</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">EXPIRES</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono text-[10px]">
                {filteredLeases.filter(Boolean).map((lease) => (
                  <tr key={lease?.[".id"] || Math.random()} className="hover:bg-cyan-500/5 group transition-colors">
                    <td className="px-6 py-4 text-white font-bold">{lease?.["host-name"] || "UNKNOWN"}</td>
                    <td className="px-6 py-4 text-cyan-400">{lease?.address || "N/A"}</td>
                    <td className="px-6 py-4 text-neutral-500">{lease?.["mac-address"] || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={lease?.status === "bound" ? "text-cyan-400" : "text-neutral-600"}>
                        {lease?.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">{lease?.["expires-after"] || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleBlacklist(lease?.address, lease?.["host-name"] || lease?.["mac-address"] || "unknown")}
                        className="h-6 px-2 text-[8px] font-bold text-red-500 hover:bg-red-500/10 hover:text-red-400 gap-1"
                      >
                        <ShieldAlert className="w-2.5 h-2.5" />
                        BAN
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
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
