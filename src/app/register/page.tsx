'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mobileConsole } from "@/utils/mobileConsole"
import { useAuth } from "@/contexts/AuthContext"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, user } = useAuth()

  // Debug info for mobile production
  useEffect(() => {
    mobileConsole.log("Register page mounted:", { 
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      timestamp: new Date().toISOString(),
      isMobile: typeof window !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) : false
    })

    return () => {
      mobileConsole.log("Register page unmounted:", { timestamp: new Date().toISOString() })
    }
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    mobileConsole.log("Registration attempt:", { username, timestamp: new Date().toISOString() })

    const result = await register(username, password)

    if (!result.success) {
      mobileConsole.error("Registration failed:", result.error)
      setError(result.error || "Registration failed.")
      mobileConsole.log("Error state set:", result.error)
    } else {
      mobileConsole.log("Registration successful:", { username, timestamp: new Date().toISOString() })
      router.push("/login")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 text-white">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-center text-2xl sm:text-3xl font-bold">Register</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={(e) => {
            mobileConsole.log("Register form submitted")
            handleSubmit(e)
          }} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => {
                  mobileConsole.log("Username input changed:", e.target.value)
                  setUsername(e.target.value)
                }}
                placeholder="Choose a username"
                className="bg-slate-700 border-slate-600 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  mobileConsole.log("Password input changed:", e.target.value.length > 0 ? "[REDACTED]" : "")
                  setPassword(e.target.value)
                }}
                placeholder="Choose a password"
                className="bg-slate-700 border-slate-600 text-white text-sm"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

