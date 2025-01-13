export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  username: string
  role: UserRole
}
