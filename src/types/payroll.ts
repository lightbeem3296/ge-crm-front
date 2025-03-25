import { extractKeys } from "@/utils/record";
import { EmployeeFilter } from "./filter";

export interface FieldMapItem {
  field?: string,
  title?: string,
}

export interface PayrollExportRequest extends PayrollExportPreviewRequest {
  filename: string,
}

export interface PayrollExportResponse {
  total_rows: number,
  preview_content: any[], // eslint-disable-line
}

export interface PayrollExportPreviewRequest {
  field_map?: FieldMapItem[],
  filter?: EmployeeFilter,
  rule?: string,
}

export interface PayrollExportPreviewResponse {
  total_rows: number,
  preview_content: any[], // eslint-disable-line
}

export const fieldMapMapping: Record<string, string> = {
  "username": "Username",
  "m_nr": "M-Nr",
  "role": "Role",
  "department": "Department",
  "initials": "Initials",
  "employer_vat_id": "Employer VAT ID",
  "employee_link": "Employee Link",
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
