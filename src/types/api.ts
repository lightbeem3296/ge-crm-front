export interface ApiCrudResponse {
  message: string,
  detail: any,
}

export interface ApiListResponse<TRowData> {
  total: number;
  skip: number;
  limit: number;
  items: TRowData[];
}
