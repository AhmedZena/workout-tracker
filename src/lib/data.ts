// Simple in-memory data store for demo purposes
// In production, you would use a proper database like PostgreSQL, MongoDB, etc.

export interface User {
  id: string
  username: string
  password: string
}

export const users: User[] = []

export function addUser(user: User) {
  users.push(user)
}

export function findUserByUsername(username: string): User | undefined {
  return users.find(user => user.username === username)
}

export function findUserById(id: string): User | undefined {
  return users.find(user => user.id === id)
}