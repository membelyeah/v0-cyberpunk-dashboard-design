"use client"

import { useState } from "react"
import { ChevronRight, Monitor, Settings, Shield, Target, Users, Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import CommandCenterPage from "./command-center/page"
import AgentNetworkPage from "./agent-network/page"
import OperationsPage from "./operations/page"
import IntelligencePage from "./intelligence/page"
import SystemsPage from "./systems/page"

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-cyan-400 font-bold text-xl tracking-tighter italic">LIENKA WAF</h1>
              <p className="text-neutral-500 text-[10px] font-mono tracking-widest uppercase">Security Node Activated</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-cyan-400"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", icon: Monitor, label: "WAF OVERVIEW" },
              { id: "agents", icon: Users, label: "STAGE 1: CABLING" },
              { id: "operations", icon: Target, label: "STAGE 2: ITNSA" },
              { id: "intelligence", icon: Shield, label: "STAGE 3: CLOUD" },
              { id: "systems", icon: Settings, label: "STAGE 4: CYBER SEC" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className={`w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6 ${activeSection === item.id ? "animate-pulse" : ""}`} />
                {!sidebarCollapsed && <span className="text-xs font-bold tracking-wider">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg backdrop-blur-sm shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                <span className="text-[10px] font-bold text-cyan-400 tracking-tighter">GATEWAY ONLINE</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono space-y-1">
                <div className="flex justify-between"><span>UPTIME:</span> <span className="text-neutral-300">72:14:33</span></div>
                <div className="flex justify-between"><span>IP LIST:</span> <span className="text-neutral-300">847 NODES</span></div>
                <div className="flex justify-between"><span>THREATS:</span> <span className="text-red-500">23 ACTIVE</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-[10px] text-neutral-400 font-mono tracking-widest">
              LIENKA GATEWAY / <span className="text-cyan-400 uppercase font-bold">{activeSection.replace('-', ' ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] text-neutral-500 font-mono">NODE SYNC: 05/02/2026 13:55 WIB</div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-cyan-400">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-cyan-400">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "overview" && <CommandCenterPage />}
          {activeSection === "agents" && <AgentNetworkPage />}
          {activeSection === "operations" && <OperationsPage />}
          {activeSection === "intelligence" && <IntelligencePage />}
          {activeSection === "systems" && <SystemsPage />}
        </div>
      </div>
    </div>
  )
}
