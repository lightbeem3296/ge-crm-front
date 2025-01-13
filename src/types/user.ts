import { extractKeys } from "@/utils/record"

export enum UserRole {
  INACTIVE = "inactive",
  USER = "user",
  ADMIN = "admin",
}
export const userRoleFieldMap: Record<string, string> = {
  "inactive": "Inactive",
  "user": "User",
  "admin": "Administrator",
}
export const userRoleFieldCodes = extractKeys(userRoleFieldMap);

export interface User {
  username: string
  role: UserRole
}

export interface UserCount {
  total: number
  admin: number
  user: number
  inactive: number
}
