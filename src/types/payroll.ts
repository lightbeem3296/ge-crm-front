import { extractKeys } from "@/utils/record";
import { ComparableFilterField, StringFilterField, ObjectFilterField } from "./filter";

export interface FieldMapItem {
  field: string,
  title: string,
}

export enum PayrollExportFilterField {
  USERNAME = "username",
  M_NR = "m_nr",
  ROLE = "role",
  DEPARTMENT = "department",
  EMPLOYMENT_START_DATE = "employment_start_date",
  EMPLOYMENT_END_DATE = "employment_end_date",
  SALARY_TYPE = "salary_type",
  HOURLY_RATE = "hourly_rate",
  HOURS_WORKED = "hours_worked",
  POINTS_EARNED = "points_earned",
  SALARY = "salary",
  BONUS = "bonus",
  DEDUCTION = "deduction",
}

export interface PayrollExportFilter {
  username?: StringFilterField,
  m_nr?: ObjectFilterField,
  role?: ObjectFilterField,
  department?: StringFilterField,
  employment_start_date?: ComparableFilterField,
  employment_end_date?: ComparableFilterField,
  salary_type?: ObjectFilterField,
  hourly_rate?: ComparableFilterField,
  hours_worked?: ComparableFilterField,
  points_earned?: ComparableFilterField,
  salary?: ComparableFilterField,
  bonus?: ComparableFilterField,
  deduction?: ComparableFilterField,
}

export interface PayrollExportRequest extends PayrollExportPreviewRequest {
  filename: string,
}

export interface PayrollExportResponse {
  total_rows: number,
  preview_content: any[],
}

export interface PayrollExportPreviewRequest {
  field_map?: FieldMapItem[],
  filter?: PayrollExportFilter,
  rule?: string,
}

export interface PayrollExportPreviewResponse {
  total_rows: number,
  preview_content: any[],
}

export const fieldMapMapping: Record<string, string> = {
  "username": "Username",
  "m_nr": "M-Nr",
  "role": "Role",
  "department": "Department",
  "employment_start_date": "Employment Start Date",
  "employment_end_date": "Employment End Date",
  "salary_type": "Salary Type",
  "hourly_rate": "Hourly Rate",
  "hours_worked": "Hours Worked",
  "points_earned": "Points Earned",
  "salary": "Salary",
  "bonus": "Bonus",
  "deduction": "Deduction",
  "tags": "Tags",
}
export const fieldMapCodes = extractKeys(fieldMapMapping);
