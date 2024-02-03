import { isString, merge } from 'lodash';
import { extractQuery, isQueryEmpty, trimTrailingSlash } from './utils';
import { QueryParamsObject, URLWithQueryParams } from './types';

export interface QueryStringLibrary {
  parse: (url: string) => QueryParamsObject;
  stringify: (query: QueryParamsObject) => string;
}

interface BaseUrlOptions {
  removeTrailingSlash?: boolean;
}

export interface QueryBaseOptions {
  queryString: QueryStringLibrary;
  baseUrlOptions?: BaseUrlOptions;
}
export interface QueryParserOptions extends Omit<QueryStringLibrary, 'stringify'>, BaseUrlOptions {}
export interface QueryStringifyOptions extends Omit<QueryStringLibrary, 'parse'>, BaseUrlOptions {}

export interface QueryUpdateOptions extends QueryParserOptions {
  mergeQuery?: (oldQuery: QueryParamsObject, newQuery: QueryParamsObject) => QueryParamsObject;
}

export const urlStringify = (
  url: string,
  query: QueryParamsObject,
  { stringify, removeTrailingSlash }: QueryStringifyOptions
) => {
  const { baseUrl } = extractQuery(url);
  const _url = removeTrailingSlash ? trimTrailingSlash(baseUrl) : baseUrl;
  return isQueryEmpty(query) ? _url : `${_url}?${stringify(query)}`;
};

export const urlParse = (
  url: string | Omit<URLWithQueryParams, 'queryParams'>,
  { parse, removeTrailingSlash }: QueryParserOptions
): URLWithQueryParams => {
  const { baseUrl, queryString } = extractQuery(url);
  const _url = removeTrailingSlash ? trimTrailingSlash(baseUrl) : baseUrl;
  return {
    baseUrl: _url,
    queryParams: queryString ? parse(queryString) : {}
  };
};

export const urlQueryUpdate = (
  url: string | URLWithQueryParams,
  query: QueryParamsObject,
  { parse, removeTrailingSlash, mergeQuery = merge }: QueryUpdateOptions
): URLWithQueryParams => {
  const { baseUrl, queryParams } = isString(url) ? urlParse(url, { parse, removeTrailingSlash }) : url;

  return {
    baseUrl: removeTrailingSlash ? trimTrailingSlash(baseUrl) : baseUrl,
    queryParams: mergeQuery(queryParams, query)
  };
};

export const defineUrlInstance = ({ queryString, baseUrlOptions }: QueryBaseOptions) => ({
  parse: (url: string | Omit<URLWithQueryParams, 'queryParams'>, options?: Partial<QueryParserOptions>) =>
    urlParse(url, { ...queryString, ...baseUrlOptions, ...options }),
  stringify: (url: string, query: QueryParamsObject, options?: Partial<QueryStringifyOptions>) =>
    urlStringify(url, query, { ...queryString, ...baseUrlOptions, ...options }),
  update: (url: string | URLWithQueryParams, query: QueryParamsObject, options?: Partial<QueryUpdateOptions>) =>
    urlQueryUpdate(url, query, { ...queryString, ...baseUrlOptions, ...options })
});
