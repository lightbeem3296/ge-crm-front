import axios from "axios";

interface RoleRowData {
  _id: string,
  role_name: string;
  description: string;
}

interface RoleServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: RoleRowData[];
}

export async function getRoleMappings(skip: number = 0, limit: number = 0) {
  let all_roles: Record<string, string> = {};
  const response = await axios.get<RoleServerResponse>(
    'http://localhost:8000/api/role',
    {
      params: {
        skip: skip,
        limit: limit,
      },
    }
  );
  response.data.items.forEach(item => {
    all_roles[item._id] = item.role_name
  });
  return all_roles;
}
