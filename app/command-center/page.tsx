import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommandCenterPage() {
  const [stats, setStats] = useState<any>(null)
  const [addressLists, setAddressLists] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, addrRes] = await Promise.all([
          fetch("/api/mikrotik/stats"),
          fetch("/api/mikrotik/address-list")
        ])
        
        const statsData = await statsRes.json()
        const addrData = await addrRes.json()
        
        setStats(statsData)
        setAddressLists(addrData.stages)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch MikroTik data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Status Overview */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3 border-b border-cyan-500/20 bg-cyan-500/5">
            <CardTitle className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
              IP STAGE ALLOCATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono tracking-tighter">
                  {loading ? "..." : addressLists?.stage1 || 0}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase">Stage 1</div>
              </div>
              <div className="text-center border-x border-neutral-800">
                <div className="text-2xl font-bold text-white font-mono tracking-tighter">
                  {loading ? "..." : addressLists?.stage2 || 0}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase">Stage 2</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono tracking-tighter">
                  {loading ? "..." : addressLists?.stage4 || 0}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase">Stage 4</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: "G-078W", name: "VENGEFUL SPIRIT", status: "active" },
                { id: "G-079X", name: "OBSIDIAN SENTINEL", status: "standby" },
                { id: "G-080Y", name: "GHOSTLY FURY", status: "active" },
                { id: "G-081Z", name: "CURSED REVENANT", status: "compromised" },
              ].map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        agent.status === "active"
                          ? "bg-white"
                          : agent.status === "standby"
                            ? "bg-neutral-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <div className="text-xs text-white font-mono">{agent.id}</div>
                      <div className="text-xs text-neutral-500">{agent.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3 border-b border-cyan-500/20 bg-cyan-500/5">
            <CardTitle className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
              SECURITY EVENTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[
                {
                  time: "25/06/2025 09:29",
                  agent: "gh0st_Fire",
                  action: "completed mission in",
                  location: "Berlin",
                  target: "zer0_Nigh",
                },
                {
                  time: "25/06/2025 08:12",
                  agent: "dr4g0n_V3in",
                  action: "extracted high-value target in",
                  location: "Cairo",
                  target: null,
                },
                {
                  time: "24/06/2025 22:55",
                  agent: "sn4ke_Sh4de",
                  action: "lost communication in",
                  location: "Havana",
                  target: null,
                },
                {
                  time: "24/06/2025 21:33",
                  agent: "ph4nt0m_R4ven",
                  action: "initiated surveillance in",
                  location: "Tokyo",
                  target: null,
                },
                {
                  time: "24/06/2025 19:45",
                  agent: "v0id_Walk3r",
                  action: "compromised security in",
                  location: "Moscow",
                  target: "d4rk_M4trix",
                },
              ].map((log, index) => (
                <div
                  key={index}
                  className="text-[10px] border-l-2 border-cyan-500 pl-3 hover:bg-cyan-500/5 p-2 rounded transition-colors group"
                >
                  <div className="text-neutral-500 font-mono mb-1">{log.time}</div>
                  <div className="text-neutral-300">
                    <span className="text-cyan-400 font-bold font-mono">GATEWAY_WAF:</span> {log.action}{" "}
                    <span className="text-white font-bold">{log.location}</span>
                    {log.target && (
                      <span>
                        {" "}
                        node <span className="text-cyan-400 font-mono">{log.target}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Encrypted Chat Activity */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              ENCRYPTED CHAT ACTIVITY
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Wireframe Sphere */}
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 border-2 border-white rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute inset-2 border border-white rounded-full opacity-40"></div>
              <div className="absolute inset-4 border border-white rounded-full opacity-20"></div>
              {/* Grid lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-white opacity-30"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-white opacity-30"></div>
              </div>
            </div>

            <div className="text-xs text-neutral-500 space-y-1 w-full font-mono">
              <div className="flex justify-between">
                <span># 2025-06-17 14:23 UTC</span>
              </div>
              <div className="text-white">{"> [SYS:KERNEL] ::: LOAD >> modules/waf_filter"}</div>
              <div className="text-cyan-400">{"> REST_API | 192.168.8.1:443...OK"}</div>
              <div className="text-white">{"> KEY LOCKED"}</div>
              <div className="text-neutral-400">
                {'> MSG >> "...mission override initiated... awaiting delta node clearance"'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Activity Chart */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3 border-b border-cyan-500/20 bg-cyan-500/5">
            <CardTitle className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
              TRAFFIC MONITORING (Mbps)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative">
              {/* Chart Grid */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-neutral-700"></div>
                ))}
              </div>

              {/* Chart Line */}
              <svg className="absolute inset-0 w-full h-full">
                <polyline
                  points="0,120 50,100 100,110 150,90 200,95 250,85 300,100 350,80"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                />
                <polyline
                  points="0,140 50,135 100,130 150,125 200,130 250,135 300,125 350,120"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-5 font-mono">
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-neutral-500 -mb-6 font-mono">
                <span>Jan 28, 2025</span>
                <span>Feb 28, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Information */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3 border-b border-cyan-500/20 bg-cyan-500/5">
            <CardTitle className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
              NETWORK SUMMARY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 font-mono text-[10px]">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">IDENTITY:</span>
                  <span className="text-cyan-400 font-bold">{loading ? "CONNECTING..." : stats?.identity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">BOARD:</span>
                  <span className="text-white">{loading ? "..." : stats?.board}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">UPTIME:</span>
                  <span className="text-white">{loading ? "..." : stats?.uptime}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-800 pt-2">
                  <span className="text-neutral-500">CPU LOAD:</span>
                  <span className={stats?.cpuLoad > 80 ? "text-red-500" : "text-green-500"}>
                    {loading ? "..." : `${stats?.cpuLoad}%`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">TOTAL NODES:</span>
                  <span className="text-white">{loading ? "..." : addressLists?.total || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
