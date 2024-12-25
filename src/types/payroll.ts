import { extractKeys } from "@/utils/record";
import { ComparableFilterField, StringFilterField, ValueFilterField } from "./filter";

export interface FieldMapItem {
  field: string,
  title: string,
}

export interface PayrollExportFilter {
  username?: StringFilterField,
  m_nr?: ValueFilterField<number>,
  role?: ValueFilterField<string>,
  department?: StringFilterField,
  employment_start_date?: ComparableFilterField<string>,
  employment_end_date?: ComparableFilterField<string>,
  salary_type?: ValueFilterField<string>,
  hourly_rate?: ComparableFilterField<number>,
  hours_worked?: ComparableFilterField<number>,
  points_earned?: ComparableFilterField<number>,
  salary?: ComparableFilterField<number>,
  bonus?: ComparableFilterField<number>,
  deduction?: ComparableFilterField<number>,
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
