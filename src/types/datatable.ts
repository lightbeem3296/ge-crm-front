import { extractKeys } from "@/utils/record";
import { CustomCellRendererProps } from "ag-grid-react";

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
  salary: number;
  hours_worked: number;
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

export enum RuleConditionField {
  ROLE = "Role",
  POINTS_EARNED = "Points Earned",
  HOURS_WORKED = "Hours Worked",
}
export const ruleConditionFieldMap: Record<string, string> = {
  "Role": "Role",
  "Points Earned": "Points Earned",
  "Hours Worked": "Hours Worked",
}
export const ruleConditionFieldCodes = extractKeys(ruleConditionFieldMap);

export enum RuleConditionNumberOperator {
  EQ = "==",
  NE = "!=",
  GT = ">",
  GTE = ">=",
  LT = "<",
  LTE = "<=",
}
export const ruleConditionNumberOperatorMap: Record<string, string> = {
  "==": "EQ",
  "!=": "NE",
  ">": "GT",
  ">=": "GTE",
  "<": "LT",
  "<=": "LTE",
}
export const ruleConditionNumberOperatorCodes = extractKeys(ruleConditionNumberOperatorMap);

export enum RuleConditionObjectOperator {
  EQ = "==",
  NE = "!=",
}
export const ruleConditionObjectOperatorMap: Record<string, string> = {
  "==": "EQ",
  "!=": "NE",
}
export const ruleConditionObjectOperatorCodes = extractKeys(ruleConditionObjectOperatorMap);

export interface AtomCondition {
  field: string;
  operator: string;
  value: string | number;
}

export enum RuleConditionCombinationOperator {
  NONE = "none",
  NOT = "not",
  AND = "and",
  OR = "or",
}
export const ruleConditionCombinationOperatorMap: Record<string, string> = {
  "none": "None",
  "not": "NOT",
  "and": "AND",
  "or": "OR",
}
export const ruleConditionCombinationOperatorCodes = extractKeys(ruleConditionCombinationOperatorMap)

export interface RuleCondition {
  combination: string;
  conditions: AtomCondition[];
}

export enum RuleActionField {
  SALARY = "Salary",
  BONUS = "Bonus",
  DEDUCTION = "Deduction",
}
export const ruleActionFieldMap: Record<string, string> = {
  "Salary": "Salary",
  "Bonus": "Bonus",
  "Deduction": "Deduction",
}
export const ruleActionFieldCodes = extractKeys(ruleActionFieldMap);

export enum RuleActionOperator {
  ADD = "+",
  SUBTRACT = "-",
  MULTIPLY = "*",
  DEVIDE = "/",
}
export const ruleActionOperatorMap: Record<string, string> = {
  "+": "Add",
  "-": "Subtract",
  "*": "Multiply",
  "/": "Divide",
}
export const ruleActionOperatorCodes = extractKeys(ruleActionOperatorMap);

export interface RuleAction {
  field: string;
  operator: string;
  value: number;
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
