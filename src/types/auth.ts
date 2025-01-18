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


export enum TfaType {
  otp = "otp",
  sms = "sms",
}

export interface User {
  username: string
  role: UserRole
  tfa_type: TfaType | undefined
  totp_secret: string | undefined
}

export interface UserCount {
  total: number
  admin: number
  user: number
  inactive: number
}

export interface ChangePasswordRequest {
  password: string
}

export interface GenerateOTPResponse {
  totp_secret: string
}

export interface VerifyOTPRequest {
  totp_secret: string
  otp_code: string
}

export interface EnableOTPRequest {
  totp_secret: string
}

export interface LoginOTPRequest {
  username: string
  password: string
  otp: string
}

export enum AuthResult {
  success = "success",
  otp = "otp",
  sms = "sms",
}

export interface Token {
  access_token: string
  token_type: string
}

export interface AuthResponse {
  result: AuthResult
  token: Token | null
}
