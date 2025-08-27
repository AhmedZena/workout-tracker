import db from "./db"

export interface DBUser {
  id: number
  username: string
  password: string
}

export function findUserByUsername(username: string): DBUser | undefined {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username) as DBUser | undefined
}

export function createUser(username: string, passwordHash: string): void {
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, passwordHash)
}
