"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserX, TrendingUp, School } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const absenceReasonsData = [
  { name: "Diarrhoea", value: 45, color: "#ef4444" },
  { name: "Various reasons", value: 35, color: "#3b82f6" },
  { name: "School fees", value: 8, color: "#eab308" },
  { name: "Malaria", value: 7, color: "#10b981" },
  { name: "Typhoid", value: 3, color: "#8b5cf6" },
  { name: "Flu", value: 2, color: "#f97316" },
]

const attendanceByDistrictData = [
  { district: "Kisoro", present: 100, absent: 35 },
  { district: "Isingiro", present: 120, absent: 60 },
  { district: "KikorO", present: 5, absent: 3 },
  { district: "Kaliro", present: 8, absent: 5 },
  { district: "Ibanda", present: 42, absent: 38 },
  { district: "Rak", present: 42, absent: 26 },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const authUser = localStorage.getItem("authUser")
    if (authUser) {
      setUser(JSON.parse(authUser))
    } else {
      // Redirect to login if not authenticated
      window.location.href = "/"
    }
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader user={user} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>🏠</span>
              <span>/</span>
              <span>Dashboard</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Present Card */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Present</p>
                      <p className="text-3xl font-bold text-gray-900">317</p>
                      <p className="text-sm text-gray-500">students attended</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Absent Card */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Absent</p>
                      <p className="text-3xl font-bold text-gray-900">167</p>
                      <p className="text-sm text-gray-500">students absent</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <UserX className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Rate Card */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
                      <p className="text-3xl font-bold text-gray-900">65.5%</p>
                      <p className="text-sm text-gray-500">overall attendance</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schools Card */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Schools</p>
                      <p className="text-3xl font-bold text-gray-900">33</p>
                      <p className="text-sm text-gray-500">across 7 districts</p>
                    </div>
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                      <School className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Absence Reasons Pie Chart */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Absence Reasons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={absenceReasonsData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {absenceReasonsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    {absenceReasonsData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Attendance by District Bar Chart */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Attendance by District</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceByDistrictData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="district" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                        <YAxis
                          label={{ value: "Number of Students", angle: -90, position: "insideLeft" }}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" fill="#3b82f6" name="Present" />
                        <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
