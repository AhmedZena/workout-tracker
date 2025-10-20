'use client'

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Debug info for mobile production
  useEffect(() => {
    console.log("Login page mounted:", { 
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      timestamp: new Date().toISOString(),
      isMobile: typeof window !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) : false
    })

    return () => {
      console.log("Login page unmounted:", { timestamp: new Date().toISOString() })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("Login attempt:", { username, timestamp: new Date().toISOString() })

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    })

    if (result?.error) {
      console.error("Login failed:", result.error)
      setError("Invalid username or password.")
      console.log("Error state set:", "Invalid username or password.")
    } else {
      console.log("Login successful:", { username, timestamp: new Date().toISOString() })
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 text-white">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-center text-2xl sm:text-3xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={(e) => {
            console.log("Login form submitted")
            handleSubmit(e)
          }} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => {
                  console.log("Username input changed:", e.target.value)
                  setUsername(e.target.value)
                }}
                placeholder="Enter your username"
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
                  console.log("Password input changed:", e.target.value.length > 0 ? "[REDACTED]" : "")
                  setPassword(e.target.value)
                }}
                placeholder="Enter your password"
                className="bg-slate-700 border-slate-600 text-white text-sm"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

