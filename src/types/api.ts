export interface ApiCrudResponse {
  message: string,
  detail: any, // eslint-disable-line
}

export interface ApiListResponse<TRowData> {
  total: number;
  skip: number;
  limit: number;
  items: TRowData[];
}
