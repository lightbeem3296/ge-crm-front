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
  depositions_date: string,
  paycheck_period_start: string,
  paycheck_period_end: string,
  field_map?: FieldMapItem[],
  filter?: EmployeeFilter,
  rule?: string,
}

export interface PayrollExportPreviewResponse {
  total_rows: number,
  preview_content: any[], // eslint-disable-line
}

export const fieldMapMapping: Record<string, string> = {
  // Employee Fields
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

  // Calculated Fields
  "calculated_salary": "Calculated Salary",
  "calculated_bonus": "Calculated Bonus",
  "calculated_deduction": "Calculated Deduction",
  "calculated_hourly_rate": "Calculated Hourly Rate",
  "calculated_hours_worked": "Calculated Hours Worked",
  "calculated_points_earned": "Calculated Points Earned",
  "total": "Total Salary",

  // Custom Field
  "custom_field": "Custom Field",
}
export const fieldMapCodes = extractKeys(fieldMapMapping);
export const initialFieldMapCodes = [
  "username",
  "m_nr",
  "role",
  "department",
  "initials",
  "employer_vat_id",
  "employee_link",
  "employment_start_date",
  "employment_end_date",
  "salary_type",
  "hourly_rate",
  "hours_worked",
  "points_earned",
  "salary",
  "bonus",
  "deduction",
  "tags",
  "total",
  "custom_field",
];
