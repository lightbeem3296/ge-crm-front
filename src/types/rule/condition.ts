import { extractKeys } from "@/utils/record";
import { EmployeeFilter } from "../filter";

export interface AtomCondition {
  condition_name: string;
  filter: EmployeeFilter;
}

export enum RuleConditionCombinator {
  NONE = "NONE",
  NOT = "NOT",
  AND = "AND",
  OR = "OR",
}
export const ruleConditionCombinatorMap: Record<string, string> = {
  "NONE": "None",
  "NOT": "NOT",
  "AND": "AND",
  "OR": "OR",
}
export const ruleConditionCombinatorCodes = extractKeys(ruleConditionCombinatorMap)

export interface RuleCondition {
  combinator: string;
  conditions: AtomCondition[];
}
