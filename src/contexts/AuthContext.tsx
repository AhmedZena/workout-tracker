'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mobileConsole } from '@/utils/mobileConsole'

interface User {
  id: string
  username: string
  name: string
  email: string
}

interface StoredUser {
  id: string
  username: string
  password: string
}

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
      // Get users from localStorage
      const storedUsers = localStorage.getItem('workout-tracker-users')
      if (!storedUsers) {
        return { success: false, error: 'No users found. Please register first.' }
      }

      const users: StoredUser[] = JSON.parse(storedUsers)
      const user = users.find((u: StoredUser) => u.username === username)

      if (!user) {
        return { success: false, error: 'Invalid username or password.' }
      }

      // Simple password check (in a real app, you'd want to hash passwords)
      if (user.password !== password) {
        return { success: false, error: 'Invalid username or password.' }
      }

      // Create user session
      const userSession = {
        id: user.id,
        username: user.username,
        name: user.username,
        email: user.username
      }

      // Store user in localStorage
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
      // Get existing users from localStorage
      const storedUsers = localStorage.getItem('workout-tracker-users')
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : []

      // Check if user already exists
      if (users.find((u: StoredUser) => u.username === username)) {
        return { success: false, error: 'User already exists.' }
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        password // In a real app, you'd hash this
      }

      // Save user to localStorage
      users.push(newUser)
      localStorage.setItem('workout-tracker-users', JSON.stringify(users))

      mobileConsole.log('User registered:', newUser.username)
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