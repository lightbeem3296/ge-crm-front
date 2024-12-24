import { extractKeys } from "@/utils/record";

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
