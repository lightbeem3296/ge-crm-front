import { axiosHelper } from "@/lib/axios";

interface RowData {
  _id: string,
  rule_name: string;
  description: string;
}

interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: RowData[];
}

export async function getRuleMappings(skip: number = 0, limit: number = 0) {
  const all_rules: Record<string, string> = {};
  const resp = await axiosHelper.get<ServerResponse>(
    "/rule/list",
    {
      params: {
        skip: skip,
        limit: limit,
      },
    }
  );
  resp?.items.forEach(item => { all_rules[item._id] = item.rule_name });
  return all_rules;
}

export async function getRuleDisplay(ruleId: string): Promise<string | undefined> {
  return await axiosHelper.get<string>(`/rule/display/${ruleId}`);
}
