export type QueryParamsObject = { [key: string]: any };

export interface UrlWithQueryParams {
  baseUrl: string;
  queryParams: QueryParamsObject;
}
