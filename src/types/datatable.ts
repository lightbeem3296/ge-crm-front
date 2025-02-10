import { CustomCellRendererProps } from "ag-grid-react";
import { RuleAction } from "./rule/action";
import { RuleCondition } from "./rule/condition";
import { UserRole } from "./auth";

export interface ActionCellRenderParams<TRowData> extends CustomCellRendererProps {
  onSave?: (obj: TRowData) => void;
  onDelete?: (obj: TRowData) => void;
  onEdit?: (obj: TRowData) => void;
}

interface BaseRowData {
  _is_modified?: boolean;
  _is_created?: boolean;
}

export interface EmployeeRowData extends BaseRowData {
  _id?: string,

  name: string,
  m_nr: number,
  employment_type: string,
  comment: string,
  mileage_allowance: string,
  lunch: string,
  department: string,
  tax_deduction_card: string,
  applicable_rate: number,
  points_earned: number,
  points_earned_extra: number,
  points_deduction: number,
  fixed_salary_bonus_kr: number,
  first_work_date: string,
  last_work_date: string | null,
  holiday_settlement: string,
  earned_points_auto_generated: number,
  salary_type: string | null,
  role: string | null,
  tags: string[],
  name_q: string | null,
  employment_type_r: string | null,
  start_pay_period: string | null,
  end_pay_period: string | null,
  comment_w: string | null,
  lunch_code: string | null,
  lunch_code_justification: string | null,
  points_total: number | null,
  points_bonus: number | null,
  total_kr: number | null,
  total_salary: number | null,
  available_on_account: string | null,
  lunch_standard: string | null,
  m_nr_aq: number | null,
  payroll_code: string | null,
  danlon_file_payroll: string | null,
  auto_comments: string | null,
  calculated_norm_hours: number | null,
  department_az: string | null,
}

export interface TagRowData extends BaseRowData {
  _id?: string;

  tag_name: string;
  description: string;
}

export interface RoleRowData extends BaseRowData {
  _id?: string;

  role_name: string;
  description: string;
}

export interface SalaryTypeRowData extends BaseRowData {
  _id?: string;

  salary_type_name: string;
  description: string;
}

export interface AtomRule {
  condition: RuleCondition;
  action: RuleAction;
}

export interface RuleRowData extends BaseRowData {
  _id?: string;

  rule_name: string;
  description: string;
  atom_rules: AtomRule[];

  display?: string;
}

export interface UserRowData extends BaseRowData {
  _id?: string;

  username: string;
  password: string | null;
  role: UserRole;
}
