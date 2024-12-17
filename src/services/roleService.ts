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


export async function listRoles(skip: number = 0, limit: number = 0) {
  let all_roles: { [key: string]: {role_name: string, description: string}} = {};
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
    all_roles[item._id] = {
      role_name: item.role_name,
      description: item.description,
    }
  });
  return all_roles;
}
