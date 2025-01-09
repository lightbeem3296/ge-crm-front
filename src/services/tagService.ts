import { axiosHelper } from "@/lib/axios";

interface RowData {
  _id: string,
  tag_name: string;
  description: string;
}

interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: RowData[];
}

export async function getTagMappings(skip: number = 0, limit: number = 0) {
  const all_tags: Record<string, string> = {};
  const resp = await axiosHelper.get<ServerResponse>(
    "/tag/list",
    {
      params: {
        skip: skip,
        limit: limit,
      },
    }
  );
  resp?.items.forEach(item => { all_tags[item._id] = item.tag_name });
  return all_tags;
}
