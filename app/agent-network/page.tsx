"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreHorizontal, Activity, Cpu, Zap, Radio, Power } from "lucide-react"

export default function CablingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [interfaces, setInterfaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInterfaces = async () => {
      try {
        const res = await fetch("/api/mikrotik/interfaces")
        const data = await res.json()
        if (Array.isArray(data)) {
          setInterfaces(data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch interfaces:", error)
      }
    }

    fetchInterfaces()
    const interval = setInterval(fetchInterfaces, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredInterfaces = interfaces.filter(
    (iface) =>
      iface.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iface.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeCount = interfaces.filter(i => i.running === "true").length
  const disabledCount = interfaces.filter(i => i.disabled === "true").length

  const handleToggle = async (id: string, currentDisabled: string) => {
    try {
      const res = await fetch("/api/mikrotik/interfaces/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, disabled: currentDisabled === "false" }) // Toggle current state
      })
      if (res.ok) {
        // Refresh data immediately
        const refreshRes = await fetch("/api/mikrotik/interfaces")
        const newData = await refreshRes.json()
        setInterfaces(newData)
      }
    } catch (error) {
      console.error("Failed to toggle interface:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 tracking-tighter italic">STAGE 1: CABLING & PHYSICAL</h1>
          <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">Monitoring physical link layer and interface status</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs font-bold font-mono">
            SCAN PORTS
          </Button>
          <Button className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-xs font-bold font-mono">
            <Filter className="w-3 h-3 mr-2" />
            FILTER
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 bg-neutral-900/50 border-neutral-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search interfaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800/50 border-neutral-700 text-cyan-400 placeholder-neutral-500 text-xs font-mono"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-700 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500 tracking-wider font-bold">RUNNING LINKS</p>
              <p className="text-2xl font-bold text-white font-mono">{loading ? "..." : activeCount}</p>
            </div>
            <Activity className="w-8 h-8 text-cyan-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-700 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500 tracking-wider font-bold">DISABLED PORTS</p>
              <p className="text-2xl font-bold text-red-500 font-mono">{loading ? "..." : disabledCount}</p>
            </div>
            <Zap className="w-8 h-8 text-red-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-700 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500 tracking-wider font-bold">TOTAL INTERFACES</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono">{loading ? "..." : interfaces.length}</p>
            </div>
            <Radio className="w-8 h-8 text-cyan-400 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Interface List */}
      <Card className="bg-neutral-900/80 border-neutral-700 backdrop-blur-md overflow-hidden">
        <CardHeader className="bg-cyan-500/5 border-b border-cyan-500/20">
          <CardTitle className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] uppercase">PHYSICAL INTERFACE ROSTER</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-neutral-500 tracking-widest uppercase">NAME</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-neutral-500 tracking-widest uppercase">TYPE</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-neutral-500 tracking-widest uppercase">STATUS</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-neutral-500 tracking-widest uppercase">MAC ADDRESS</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-neutral-500 tracking-widest uppercase">TX / RX BYTES</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-neutral-500 tracking-widest uppercase">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-neutral-500 font-mono text-xs animate-pulse">
                      SYNCING WITH MIKROTIK GATEWAY...
                    </td>
                  </tr>
                ) : filteredInterfaces.map((iface, index) => (
                  <tr
                    key={iface.id}
                    className="hover:bg-cyan-500/5 transition-colors group"
                  >
                    <td className="py-4 px-6 text-xs text-white font-bold font-mono italic">{iface.name}</td>
                    <td className="py-4 px-6 text-[10px] text-neutral-400 font-mono">{iface.type}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            iface.running === "true"
                              ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"
                              : "bg-neutral-600"
                          }`}
                        ></div>
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${iface.running === "true" ? "text-cyan-400" : "text-neutral-500"}`}>
                          {iface.running === "true" ? "RUNNING" : "LINK DOWN"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[10px] text-neutral-300 font-mono">{iface["mac-address"] || "N/A"}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="text-[10px] text-neutral-500 font-mono flex justify-between w-32">
                          <span>TX:</span> <span className="text-white">{(parseInt(iface["tx-byte"]) / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono flex justify-between w-32">
                          <span>RX:</span> <span className="text-white">{(parseInt(iface["rx-byte"]) / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggle(iface[".id"], iface.disabled)}
                        className={`w-8 h-8 rounded-full border transition-all ${
                          iface.disabled === "false" 
                            ? "border-cyan-500/30 text-cyan-400 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50" 
                            : "border-neutral-700 text-neutral-600 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50"
                        }`}
                        title={iface.disabled === "false" ? "Disable Interface" : "Enable Interface"}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-cyan-400 group-hover:bg-cyan-500/10">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
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
