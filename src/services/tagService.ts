import axios from "axios";

interface TagRowData {
  _id: string,
  tag_name: string;
  description: string;
}

interface TagServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: TagRowData[];
}


export async function listTags(skip: number = 0, limit: number = 0) {
  let all_tags: { [key: string]: { tag_name: string, description: string, } } = {};
  const response = await axios.get<TagServerResponse>(
    'http://localhost:8000/api/tag',
    {
      params: {
        skip: skip,
        limit: limit,
      },
    }
  );
  response.data.items.forEach(item => {
    all_tags[item._id] = {
      tag_name: item.tag_name,
      description: item.description,
    }
  });
  return all_tags;
}
