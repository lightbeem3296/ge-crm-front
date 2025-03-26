import { extractKeys } from "@/utils/record";

export enum FilterType {
  STRING_FILTER = "string",
  OBJECT_FILTER = "object",
  COMPARIBLE_FILTER = "comparable",
  LIST_FILTER = "list",
}

export enum ObjectFilterCondition {
  NE = "ne",
  EQ = "eq",
}
export const objectFilterConditionMappings: Record<string, string> = {
  "ne": "NE",
  "eq": "EQ",
}
export const objectFilterConditionCodes = extractKeys(objectFilterConditionMappings);
export class ObjectFilterField {
  value: string;
  condition: ObjectFilterCondition;

  constructor(value: string, condition: ObjectFilterCondition) {
    this.value = value;
    this.condition = condition;
  }
}

export enum StringFilterCondition {
  EQ = "eq",
  NE = "ne",
  STARTS_WITH = "starts_with",
  ENDS_WITH = "ends_with",
  CONTAINS = "contains",
}
export const stringFilterConditionMappings: Record<string, string> = {
  "eq": "EQ",
  "ne": "NE",
  "starts_with": "STARTS_WITH",
  "ends_with": "ENDS_WITH",
  "contains": "CONTAINS",
}
export const stringFilterConditionCodes = extractKeys(stringFilterConditionMappings);
export class StringFilterField {
  value: string;
  condition: StringFilterCondition;
  case_sensitive: boolean;

  constructor(value: string, condition: StringFilterCondition, case_sensitive: boolean) {
    this.value = value;
    this.condition = condition;
    this.case_sensitive = case_sensitive;
  }
}

export enum ComparableFilterCondition {
  EQ = "eq",  // ==
  NE = "ne",  // !=
  GT = "gt",  // (min, +inf)
  LT = "lt",  // (-inf, max)
  GTE = "gte",  // [min, +inf)
  LTE = "lte",  // (-inf, max]
  GT_LT = "gt_lt",  // (min, max)
  GT_LTE = "gt_lte",  // (min, max]
  GTE_LT = "gte_le",  // [min, max)
  GTE_LTE = "gte_lte",  // [min, max]
}
export const comparableFilterConditionMappings: Record<string, string> = {
  "eq": "EQ",  // ==
  "ne": "NE",  // !=
  "gt": "GT",  // (min, +inf)
  "lt": "LT",  // (-inf, max)
  "gte": "GTE",  // [min, +inf)
  "lte": "LTE",  // (-inf, max]
  "gt_lt": "GT_LT",  // (min, max)
  "gt_lte": "GT_LTE",  // (min, max]
  "gte_le": "GTE_LT",  // [min, max)
  "gte_lte": "GTE_LTE",  // [min, max]
}
export const comparableFilterConditionCodes = extractKeys(comparableFilterConditionMappings);
export class ComparableFilterField {
  value: string | string[];
  condition: ComparableFilterCondition;

  constructor(value: string | [string, string], condition: ComparableFilterCondition) {
    this.value = value;
    this.condition = condition;
  }
}

export class ListFilterField {
  value: string[];
  condition: string;

  constructor(value: string[]) {
    this.value = value;
    this.condition = "any";
  }
}


export enum EmployeeFilterField {
  USERNAME = "username",
  M_NR = "m_nr",
  ROLE = "role",
  DEPARTMENT = "department",
  INITIALS = "initials",
  EMPLOYER_VAT_ID = "employer_vat_id",
  EMPLOYEE_LINK = "employee_link",
  EMPLOYMENT_START_DATE = "employment_start_date",
  EMPLOYMENT_END_DATE = "employment_end_date",
  SALARY_TYPE = "salary_type",
  HOURLY_RATE = "hourly_rate",
  HOURS_WORKED = "hours_worked",
  POINTS_EARNED = "points_earned",
  SALARY = "salary",
  BONUS = "bonus",
  DEDUCTION = "deduction",
  TAGS = "tags",
}

export interface EmployeeFilter {
  username?: StringFilterField,
  m_nr?: ObjectFilterField,
  role?: ObjectFilterField,
  department?: StringFilterField,
  initials?: StringFilterField,
  employer_vat_id?: StringFilterField,
  employee_link?: StringFilterField,
  employment_start_date?: ComparableFilterField,
  employment_end_date?: ComparableFilterField,
  salary_type?: ObjectFilterField,
  hourly_rate?: ComparableFilterField,
  hours_worked?: ComparableFilterField,
  points_earned?: ComparableFilterField,
  salary?: ComparableFilterField,
  bonus?: ComparableFilterField,
  deduction?: ComparableFilterField,
  tags?: ListFilterField,
}