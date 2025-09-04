"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BarChart3, ShoppingCart, LogOut } from "lucide-react"
import Image from "next/image"

interface DashboardSidebarProps {
  user: {
    username: string
    role: string
  }
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [activeItem, setActiveItem] = useState("Dashboard")

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      name: "Attendance Analysis",
      icon: BarChart3,
      href: "/dashboard/attendance",
    },
    {
      name: "Dettol Sales",
      icon: ShoppingCart,
      href: "/dashboard/sales",
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("authUser")
    window.location.href = "/"
  }

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 relative">
            <Image
              src="/images/hygiene-quest-logo.jpg"
              alt="Hygiene Quest Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Dettol Hygiene Quest</h2>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeItem === item.name ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          )
        })}
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="mb-4">
          <p className="text-sm text-gray-300">Logged in as:</p>
          <p className="text-sm font-semibold capitalize">{user.username}</p>
          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
        </div>

        {/* Program Badge */}
        <div className="mb-4 p-3 bg-blue-600 rounded-lg text-center">
          <p className="text-xs font-bold text-white">DETTOL HYGIENE QUEST PROGRAM</p>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
