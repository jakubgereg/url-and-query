import { isString, merge } from 'lodash';
import { extractQuery, isQueryEmpty, trimTrailingSlash } from './utils';
import { QueryParamsObject, URLWithQueryParams } from './types';

export interface QueryStringLibrary {
  parse: (url: string) => QueryParamsObject;
  stringify: (query: QueryParamsObject) => string;
}

export interface BaseUrlOptions {
  removeTrailingSlash?: boolean;
}

export interface UrlInstanceOptions {
  queryString: QueryStringLibrary;
  baseUrlOptions?: BaseUrlOptions;
}
export interface QueryParserOptions extends Omit<QueryStringLibrary, 'stringify'>, BaseUrlOptions {}
export interface QueryStringifyOptions extends Omit<QueryStringLibrary, 'parse'>, BaseUrlOptions {}

export interface QueryUpdateOptions extends QueryParserOptions {
  mergeQuery?: (oldQuery: QueryParamsObject, newQuery: QueryParamsObject) => QueryParamsObject;
}

const urlStringify = (
  url: string,
  query: QueryParamsObject,
  { stringify, removeTrailingSlash }: QueryStringifyOptions
) => {
  const { baseUrl } = extractQuery(url);
  const _url = removeTrailingSlash ? trimTrailingSlash(baseUrl) : baseUrl;
  return isQueryEmpty(query) ? _url : `${_url}?${stringify(query)}`;
};

const urlParse = (
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

const urlQueryUpdate = (
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

/**
 * Define a new instance of URL parser and query stringifier
 * @param options - query string library and base url options
 * @returns instance with parse, stringify and update methods
 */
export const defineUrlInstance = ({ queryString, baseUrlOptions }: UrlInstanceOptions) => ({
  /**
   * Parse the URL and return the base URL and query params
   * @param url - URL string
   * @param options - query parser options
   */
  parse: (url: string | Omit<URLWithQueryParams, 'queryParams'>, options?: Partial<QueryParserOptions>) =>
    urlParse(url, { ...queryString, ...baseUrlOptions, ...options }),
  /**
   * Stringify the URL with the query param object
   *
   * **Note:** This method will `remove all` parameters from the URL and replace them with the query params defined in `query` argument
   *
   * @param url - URL string | URLWithQueryParams
   * @param query - query params object
   */
  stringify: (url: string, query: QueryParamsObject, options?: Partial<QueryStringifyOptions>) =>
    urlStringify(url, query, { ...queryString, ...baseUrlOptions, ...options }),
  /**
   * Update the query params of the URL
   * @param url - URL string | URLWithQueryParams
   */
  update: (url: string | URLWithQueryParams, query: QueryParamsObject, options?: Partial<QueryUpdateOptions>) =>
    urlQueryUpdate(url, query, { ...queryString, ...baseUrlOptions, ...options })
});
