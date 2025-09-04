"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"
import Image from "next/image"

const users = [
  { username: "superadmin", password: "admin123", role: "superadmin" },
  { username: "manager", password: "manager123", role: "manager" },
  { username: "viewer", password: "viewer123", role: "viewer" },
]

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user))
      router.push("/dashboard")
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you'd create the user account here
    alert(`Account created successfully for ${username} with role ${role}! Please login.`)
    setIsLogin(true)
    setUsername("")
    setPassword("")
    setConfirmPassword("")
    setEmail("")
    setRole("viewer")

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse"></div>
            <Image
              src="/images/hygiene-quest-logo.jpg"
              alt="Hygiene Quest Logo"
              width={120}
              height={120}
              className="drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-300 rounded-full"
            />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-pink-400 animate-bounce delay-300" />
            <Sparkles className="absolute top-2 -left-3 w-3 h-3 text-blue-400 animate-bounce delay-700" />
            <Sparkles className="absolute -top-1 left-8 w-3 h-3 text-purple-400 animate-bounce delay-1000" />
          </div>
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
          Dettol Hygiene Quest Uganda
        </h1>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Welcome to the Hygiene Quest Dashboard
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Track progress, access resources, and support better hygiene practices in Ugandan schools.
        </p>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          This platform helps schools monitor hand-washing facilities, distribute learning materials, and measure the
          impact of hygiene education across Uganda.
        </p>
      </div>

      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10"></div>
        <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 rounded-lg"></div>
        <div className="relative bg-white/95 m-0.5 rounded-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-t-lg">
            <CardTitle className="text-xl text-center bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-medium">
              {isLogin ? "Enter your credentials to access the dashboard" : "Register for a new account"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            <CardContent className="space-y-4 pt-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-emerald-700 font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-emerald-700 font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-2 border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-700 font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
                  required
                />
              </div>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-emerald-700 font-semibold">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-2 border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-emerald-700 font-semibold">
                      Role
                    </Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border-2 border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white/80 rounded-md px-3 py-2"
                      required
                    >
                      <option value="viewer">Viewer</option>
                      <option value="manager">Manager</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                </>
              )}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (isLogin ? "Signing in..." : "Creating Account...") : isLogin ? "Login" : "Register"}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                  setUsername("")
                  setPassword("")
                  setConfirmPassword("")
                  setEmail("")
                }}
                className="text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-800 hover:to-teal-800 hover:underline font-semibold transition-all duration-200"
              >
                {isLogin ? "Need an account? Register here" : "Already have an account? Login here"}
              </button>
              {isLogin && (
                <button
                  type="button"
                  className="text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-800 hover:to-teal-800 hover:underline font-semibold transition-all duration-200"
                >
                  Forgot Password?
                </button>
              )}
            </CardFooter>
          </form>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-transparent font-semibold">
        © Dettol Hygiene Quest Uganda 2025
      </div>

      {/* Demo Credentials - only show during login */}
      {isLogin && (
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>
          <CardContent className="pt-4">
            <p className="text-xs font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Demo Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100 font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Superadmin: superadmin / admin123
              </div>
              <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100 font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Manager: manager / manager123
              </div>
              <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100 font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Viewer: viewer / viewer123
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
