import { extractKeys } from "@/utils/record";

export enum RuleActionField {
  SALARY = "salary",
  BONUS = "bonus",
  DEDUCTION = "deduction",
  HOURLY_RATE = "hourly_rate",
  HOURS_WORKED = "hours_worked",
  POINTS_EARNED = "points_earned",
}
export const ruleActionFieldMap: Record<string, string> = {
  "salary": "Salary",
  "bonus": "Bonus",
  "deduction": "Deduction",
  "hourly_rate": "Horly Rate",
  "hours_worked": "Hours Worked",
  "points_earned": "Points Earned",
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
