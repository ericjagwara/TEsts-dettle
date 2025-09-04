"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, User, Settings, Bell } from "lucide-react"

interface DashboardHeaderProps {
  user: {
    username: string
    role: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - can be used for additional navigation */}
        <div className="flex items-center space-x-4">{/* This space can be used for additional controls */}</div>

        {/* Right side - Search and User Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search here"
              className="pl-10 pr-4 py-2 w-64 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <User className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
