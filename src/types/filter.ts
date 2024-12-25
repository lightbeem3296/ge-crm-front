import { extractKeys } from "@/utils/record"

export enum ValueFilterCondition {
  NE = "ne",
  EQ = "eq",
}
export const valueFilterConditionMappings: Record<string, string> = {
  "ne": "NE",
  "eq": "EQ",
}
export const valueFilterConditionCodes = extractKeys(valueFilterConditionMappings);
export interface ValueFilterField<T> {
  valie: T,
  condition: ValueFilterCondition
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
export const stringFIlterConditionCodes = extractKeys(stringFilterConditionMappings);
export interface StringFilterField {
  value: string
  condition: StringFilterCondition
  case_sensitive: boolean
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
export const comparibleFilterConditionCodes = extractKeys(comparableFilterConditionMappings);
export interface ComparableFilterField<T> {
  value: T | [T, T],
  condition: ComparableFilterCondition,
}
