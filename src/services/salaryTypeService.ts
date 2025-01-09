import { axiosHelper } from "@/lib/axios";

interface RowData {
  _id: string,
  salary_type_name: string;
  description: string;
}

interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: RowData[];
}

export async function getSalaryTypeMappings(skip: number = 0, limit: number = 0) {
  const all_objs: Record<string, string> = {};
  const resp = await axiosHelper.get<ServerResponse>(
    "/salary_type/list",
    {
      params: {
        skip: skip,
        limit: limit,
      },
    }
  );
  resp?.items.forEach(item => { all_objs[item._id] = item.salary_type_name });
  return all_objs;
}
