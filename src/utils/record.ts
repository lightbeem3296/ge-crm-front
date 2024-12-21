export function extractKeys(mappings: Record<string, string>) {
  return Object.keys(mappings);
}

export function lookupValue(mappings: Record<string, string>, key: string) {
  return mappings[key];
}
