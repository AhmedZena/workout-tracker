import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { findUserByUsername, createUser } from "@/lib/users"
import { mobileConsole } from "@/utils/mobileConsole"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    const existingUser = findUserByUsername(username)
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    createUser(username, hashedPassword)

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    mobileConsole.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

