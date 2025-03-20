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
  _id?: string;

  username: string;
  m_nr: number;
  role: string;
  department: string;
  employment_start_date: string;
  employment_end_date: string;
  salary_type: string;
  hourly_rate: number;
  hours_worked: number;
  points_earned: number;
  salary: number;
  bonus: number;
  deduction: number;
  tags: string[];
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
  rule_name: string;
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
