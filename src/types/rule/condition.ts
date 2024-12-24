import { extractKeys } from "@/utils/record";

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
