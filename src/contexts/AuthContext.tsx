'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mobileConsole } from '@/utils/mobileConsole'

interface User {
  id: string
  username: string
  name: string
  email: string
}

// Removed StoredUser interface as it's no longer needed with API-based auth

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('workout-tracker-user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        mobileConsole.log('User loaded from localStorage:', userData.username)
      }
    } catch (error) {
      mobileConsole.error('Failed to load user from localStorage:', error)
      localStorage.removeItem('workout-tracker-user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed.' }
      }

      // Create user session
      const userSession = {
        id: data.user.id,
        username: data.user.username,
        name: data.user.username,
        email: data.user.username
      }

      // Store user in localStorage for client-side state management
      localStorage.setItem('workout-tracker-user', JSON.stringify(userSession))
      setUser(userSession)
      
      mobileConsole.log('User logged in:', userSession.username)
      return { success: true }
    } catch (error) {
      mobileConsole.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Registration failed.' }
      }

      mobileConsole.log('User registered:', username)
      return { success: true }
    } catch (error) {
      mobileConsole.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('workout-tracker-user')
    setUser(null)
    mobileConsole.log('User logged out')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}