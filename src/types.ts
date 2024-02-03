export type QueryParamsObject = { [key: string]: any };

export interface URLWithQueryParams {
  baseUrl: string;
  queryParams: QueryParamsObject;
}
