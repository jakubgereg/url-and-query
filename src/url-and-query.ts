import { isEmpty, isNil, isObject, isString, merge, values } from 'lodash';
import queryString, { IParseOptions, IStringifyOptions } from 'qs';

export type QueryParamsObject = { [key: string]: unknown };
export interface URLWithQueryParams {
  baseUrl: string;
  queryParams: QueryParamsObject;
}
type QueryStringifyOptions = IStringifyOptions;
type QueryParseOptions = IParseOptions;

const DEFAULT_STRINGIFY_OPTIONS: QueryStringifyOptions = {
  encode: false,
  arrayFormat: 'brackets',
  skipNulls: true
};

const cleanupUrl = (url: string) => decodeURIComponent(url).replace(/\/$/, '');

export const updateQueryParams = (path: string, params: QueryParamsObject): URLWithQueryParams => {
  const { baseUrl, queryParams } = qpUrl(path);
  return {
    baseUrl,
    queryParams: merge(queryParams, params)
  };
};
export const extractQuery = (url: string) => {
  const [baseUrl, query] = url.split('?');
  return { baseUrl, query: query || undefined };
};
export const checkEmpty = (value: any) => (isObject(value) || isString(value) ? isEmpty(value) : isNil(value));
export const isQueryEmpty = (query: QueryParamsObject) => values(query).every(checkEmpty);
export const hasQueryParams = (url: string) => url.includes('?');
export const addQuerySeparator = (url: string) => (hasQueryParams(url) ? '&' : '?');

export const qs = (query: QueryParamsObject, options?: IStringifyOptions) =>
  queryString.stringify(query, {
    ...DEFAULT_STRINGIFY_OPTIONS,
    ...options
  });

export const qp = (value: string, options?: IParseOptions): QueryParamsObject =>
  queryString.parse(decodeURIComponent(value), options);

export const qsUrl = (url: string, query: QueryParamsObject, options?: QueryStringifyOptions) => {
  const clearUrl = cleanupUrl(url);
  return isQueryEmpty(query) ? clearUrl : `${clearUrl}${addQuerySeparator(clearUrl)}${qs(query, options)}`;
};

export const qpUrl = (url: string, options?: QueryParseOptions): URLWithQueryParams => {
  const { baseUrl, query } = extractQuery(url);
  return {
    baseUrl: cleanupUrl(baseUrl),
    queryParams: query ? qp(query, options) : {}
  };
};
