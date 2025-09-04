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
import { Checkbox } from "@/components/ui/checkbox"

interface User {
  id: number
  phone: string
  name: string
  role: string
}

interface OTPResponse {
  message: string
}

interface LoginResponse {
  id: number
  phone: string
  name: string
  role: string
}

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState<"initial" | "otp">("initial") // For OTP flow
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("fieldworker")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)
  const router = useRouter()

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://hygienequestemdpoints.onrender.com"

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLogin && !hasConsented) {
      setError("Please accept the privacy policy and terms of service to continue.")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const endpoint = isLogin
        ? `${API_BASE_URL}/dashboard/send-login-otp`
        : `${API_BASE_URL}/dashboard/send-registration-otp`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Network error occurred" }))
        throw new Error(errorData.detail || `Server error: ${response.status}`)
      }

      setStep("otp")
      setSuccess("OTP sent to your phone number")
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please check your connection and try again.")
      } else {
        setError(err.message || "Failed to send OTP. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      if (isLogin) {
        // Login with OTP
        const response = await fetch(`${API_BASE_URL}/dashboard/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, otp }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: "Login failed" }))
          throw new Error(errorData.detail || `Login failed: ${response.status}`)
        }

        const userData: LoginResponse = await response.json()

        // Store user data in localStorage
        localStorage.setItem("authUser", JSON.stringify(userData))

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        // First verify OTP for registration
        const verifyResponse = await fetch(`${API_BASE_URL}/dashboard/verify-registration-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, otp }),
          signal: controller.signal,
        })

        if (!verifyResponse.ok) {
          clearTimeout(timeoutId)
          const errorData = await verifyResponse.json().catch(() => ({ detail: "OTP verification failed" }))
          throw new Error(errorData.detail || `OTP verification failed: ${verifyResponse.status}`)
        }

        // Then register the user
        const registerResponse = await fetch(`${API_BASE_URL}/dashboard/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, name, role }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!registerResponse.ok) {
          const errorData = await registerResponse.json().catch(() => ({ detail: "Registration failed" }))
          throw new Error(errorData.detail || `Registration failed: ${registerResponse.status}`)
        }

        // Registration successful - show success message and redirect to login
        setSuccess("Registration successful! Please login with your phone number.")

        // Reset form and switch to login mode
        setTimeout(() => {
          setIsLogin(true)
          resetForm()
        }, 2000)
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please check your connection and try again.")
      } else {
        setError(err.message || "Operation failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setStep("initial")
    setPhone("")
    setOtp("")
    setName("")
    setRole("fieldworker")
    setError("")
    setSuccess("")
    setHasConsented(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse"></div>
            <Image
              src="/hygiene-quest-logo.png"
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
          Hygiene Quest
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
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-t-lg"></div>
        <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 rounded-lg"></div>
        <div className="relative bg-white/95 m-0.5 rounded-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-t-lg">
            <CardTitle className="text-xl text-center bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-medium">
              {isLogin
                ? "Enter your phone number to receive an OTP"
                : step === "initial"
                  ? "Enter your phone number to register"
                  : "Complete your registration"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={step === "initial" ? handleSendOTP : handleVerifyOTP}>
            <CardContent className="space-y-4 pt-6">
              {step === "initial" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-emerald-700 font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-2 border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-emerald-700 font-semibold">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                          <option value="fieldworker">Field Worker</option>
                          <option value="manager">Manager</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="consent"
                            checked={hasConsented}
                            onCheckedChange={(checked) => setHasConsented(checked as boolean)}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <Label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                              I agree to the collection and processing of my personal data as described in the{" "}
                              <button
                                type="button"
                                className="text-emerald-600 hover:text-emerald-800 underline font-medium"
                                onClick={() => window.open("/privacy-policy", "_blank")}
                              >
                                Privacy Policy
                              </button>{" "}
                              and{" "}
                              <button
                                type="button"
                                className="text-emerald-600 hover:text-emerald-800 underline font-medium"
                                onClick={() => window.open("/terms-of-service", "_blank")}
                              >
                                Terms of Service
                              </button>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Data Collection Notice</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      We collect your phone number and profile information to provide access to the Hygiene Quest
                      platform. Your data is used to track hygiene education progress in schools and is protected
                      according to our privacy policy.
                      {isLogin ? " By logging in, you acknowledge our data practices." : ""}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-emerald-700 font-semibold">
                      OTP Verification Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter the OTP sent to your phone"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="border-2 border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">We've sent a verification code to {phone}</p>
                </>
              )}

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading
                  ? step === "initial"
                    ? isLogin
                      ? "Sending OTP..."
                      : "Sending OTP..."
                    : isLogin
                      ? "Logging in..."
                      : "Registering..."
                  : step === "initial"
                    ? isLogin
                      ? "Send OTP"
                      : "Send OTP"
                    : isLogin
                      ? "Login"
                      : "Complete Registration"}
              </Button>

              {step === "initial" ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    resetForm()
                  }}
                  className="text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-800 hover:to-teal-800 hover:underline font-semibold transition-all duration-200"
                >
                  {isLogin ? "Need an account? Register here" : "Already have an account? Login here"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep("initial")}
                  className="text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-800 hover:to-teal-800 hover:underline font-semibold transition-all duration-200"
                >
                  Change phone number
                </button>
              )}

              {isLogin && step === "initial" && (
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
        © Hygiene Quest 2025
      </div>

      {/* Demo Info - only show during login */}
      {isLogin && step === "initial" && (
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>
          <CardContent className="pt-4">
            <p className="text-xs font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-blue-600" />
              How to Login:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100 font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                1. Enter your registered phone number
              </div>
              <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100 font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                2. Click "Send OTP" to receive a verification code
              </div>
              <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100 font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                3. Enter the OTP sent to your phone to login
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
