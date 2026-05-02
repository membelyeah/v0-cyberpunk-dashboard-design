"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Globe, ShieldCheck, Lock, ExternalLink, Database } from "lucide-react"

export default function CloudPage() {
  const [secrets, setSecrets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const res = await fetch("/api/mikrotik/ppp-secrets")
        const data = await res.json()
        if (Array.isArray(data)) {
          setSecrets(data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch PPP secrets:", error)
      }
    }

    fetchSecrets()
    const interval = setInterval(fetchSecrets, 5000)
    return () => clearInterval(interval)
  }, [])

  const activeCount = secrets.filter(s => s.disabled === "false").length

  return (
    <div className="p-6 space-y-6 text-cyan-400">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 tracking-tighter italic">STAGE 3: CLOUD & TUNNELING</h1>
          <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">Remote Access & Secure Point-to-Point Secrets</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs font-bold font-mono">
            SYNC CLOUD
          </Button>
          <Button className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-xs font-bold font-mono">
            RESOURCES
          </Button>
        </div>
      </div>

      {/* Cloud Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-neutral-900/50 border-cyan-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase flex items-center gap-2">
              <Globe className="w-3 h-3 text-cyan-500" />
              GLOBAL GATEWAY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">NODE-01</div>
            <div className="text-[10px] text-cyan-500 font-mono mt-1 animate-pulse">STATUS: OPTIMIZED</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-cyan-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase flex items-center gap-2">
              <Database className="w-3 h-3 text-cyan-500" />
              ACTIVE SECRETS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">{loading ? "..." : activeCount}</div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">TOTAL IDENTIFIED: {secrets.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-cyan-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase flex items-center gap-2">
              <Lock className="w-3 h-3 text-cyan-500" />
              ENCRYPTION LEVEL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">AES-256</div>
            <div className="text-[10px] text-cyan-500 font-mono mt-1 uppercase italic">Protocol: Strong</div>
          </CardContent>
        </Card>
      </div>

      {/* Secret Roster */}
      <Card className="bg-neutral-900/80 border-neutral-700 backdrop-blur-md">
        <CardHeader className="border-b border-neutral-800">
          <CardTitle className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase">PPP SECRETS INVENTORY</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-950/50 text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
                  <th className="px-6 py-4">USER</th>
                  <th className="px-6 py-4">SERVICE</th>
                  <th className="px-6 py-4">PROFILE</th>
                  <th className="px-6 py-4">REMOTE ADDR</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-20 animate-pulse text-xs">SYNCHRONIZING CLOUD SECRETS...</td></tr>
                ) : secrets.map((secret) => (
                  <tr key={secret.id} className="hover:bg-cyan-500/5 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-cyan-500" />
                        <span className="text-xs text-white font-bold">{secret.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-neutral-400 uppercase">{secret.service}</td>
                    <td className="px-6 py-4 text-[10px] text-cyan-500">{secret.profile}</td>
                    <td className="px-6 py-4 text-[10px] text-neutral-300">{secret["remote-address"] || "DYNAMIC"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${secret.disabled === "false" ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/5" : "border-neutral-700 text-neutral-500 bg-neutral-800"}`}>
                        {secret.disabled === "false" ? "ACTIVE" : "DISABLED"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-cyan-400 cursor-pointer" />
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
