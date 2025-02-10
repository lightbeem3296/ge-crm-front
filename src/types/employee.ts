import { extractKeys } from "@/utils/record";

export const employmentTypeMappings: Record<string, string> = {
  "FULDTID_LEDELSE": "FullTimeManagement",
  "DELTID": "PartTime", 
  "FULDTID": "FullTime",
  "SPECIEL": "Special",
  "EKSTERN": "External",
};
export const employmentTypeCodes = extractKeys(employmentTypeMappings);

export const lunchMappings: Record<string, string> = {
  "FROKOST JA": "Yes",
  "FROKOST NEJ": "No",
}
export const lunchCodes = extractKeys(lunchMappings);

export const taxDeductionCardMapping: Record<string, string> = {
  "": "Unknown",
}
export const taxDeductionCardCodes = extractKeys(taxDeductionCardMapping);