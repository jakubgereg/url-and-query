export type QueryParamsObject = { [key: string]: unknown };

export interface URLWithQueryParams {
  baseUrl: string;
  queryParams: QueryParamsObject;
}
