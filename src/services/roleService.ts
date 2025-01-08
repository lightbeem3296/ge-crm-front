import { axiosHelper } from "@/lib/axios";

interface RowData {
  _id: string,
  role_name: string;
  description: string;
}

interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: RowData[];
}

export async function getRoleMappings(skip: number = 0, limit: number = 0) {
  const all_roles: Record<string, string> = {};
  const resp = await axiosHelper.get<ServerResponse>(
    "/role",
    {
      params: {
        skip: skip,
        limit: limit,
      },
    }
  );
  resp?.items.forEach(item => { all_roles[item._id] = item.role_name });
  return all_roles;
}
