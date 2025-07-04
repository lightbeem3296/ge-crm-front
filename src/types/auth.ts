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
  otp_secret: string | undefined
  phone_number: string | undefined
  employee_filter: string | undefined
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

export interface ChangePhoneNumberRequest {
  phone_number: string
}

export interface GenerateOTPResponse {
  otp_secret: string
}

export interface VerifyOTPRequest {
  otp_secret: string
  otp_code: string
}

export interface EnableOTPRequest {
  otp_secret: string
}

export interface LoginOTPRequest {
  username: string
  password: string
  otp: string
}

export interface VerifySMSRequest {
  sms_code: string
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
