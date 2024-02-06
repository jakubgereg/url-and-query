import { isString, merge } from 'lodash';
import { QueryParamsObject, UrlWithQueryParams } from './types';
import { extractQuery, isQueryEmpty } from './utils';

export interface QueryStringLibrary<StringifyArgs extends any, ParseArgs extends any> {
  parse: (query: string, ...args: ParseArgs[]) => QueryParamsObject;
  stringify: (query: QueryParamsObject, ...args: StringifyArgs[]) => string;
}

interface QueryUpdateOptions {
  queryMerger?: (oldQuery: QueryParamsObject, newQuery: QueryParamsObject) => QueryParamsObject;
}

export const urlStringify =
  <StringifyArgs extends any>(stringify: QueryStringLibrary<StringifyArgs, unknown>['stringify']) =>
  (url: string, query: QueryParamsObject) => {
    const { baseUrl } = extractQuery(url);
    const queryString = isQueryEmpty(query) ? undefined : stringify(query);
    return queryString ? `${baseUrl}${queryString.startsWith('?') ? queryString : `?${queryString}`}` : baseUrl;
  };

export const urlParse =
  <ParseArgs extends any>(parse: QueryStringLibrary<unknown, ParseArgs>['parse']) =>
  (url: string): UrlWithQueryParams => {
    const { baseUrl, queryString } = extractQuery(url);
    return {
      baseUrl,
      queryParams: queryString ? parse(queryString) : {}
    };
  };

export const urlUpdate =
  <ParseArgs extends any>(parse: QueryStringLibrary<unknown, ParseArgs>['parse']) =>
  (
    url: string | UrlWithQueryParams,
    query: QueryParamsObject,
    { queryMerger = merge }: QueryUpdateOptions
  ): UrlWithQueryParams => {
    const { baseUrl, queryParams } = isString(url) ? urlParse(parse)(url) : url;
    return {
      baseUrl: baseUrl,
      queryParams: queryMerger(queryParams, query)
    };
  };

export interface UrlStringifyOptions<StringifyArgs extends any> {
  stringifyOptions: StringifyArgs[];
}

export interface UrlParseOptions<ParseArgs extends any> {
  parseOptions: ParseArgs[];
}

export interface UrlUpdateOptions<ParseArgs extends any> {
  parseOptions: ParseArgs[];
  queryMerger?: (oldQuery: QueryParamsObject, newQuery: QueryParamsObject) => QueryParamsObject;
}

export interface UrlDefineOptions<StringifyArgs extends any, ParseArgs extends any> {
  stringifyOptions: UrlStringifyOptions<StringifyArgs>;
  parseOptions: UrlParseOptions<ParseArgs>;
}

/**
 * Define a new instance of Url parser and query stringifier
 * @param options - query string library and base url options
 * @returns instance with parse, stringify and update methods
 */
export const defineUrl = <StringifyArgs extends any, ParseArgs extends any>(
  parser: QueryStringLibrary<StringifyArgs, ParseArgs>,
  options: Partial<UrlDefineOptions<StringifyArgs, ParseArgs>> = {}
) => ({
  /**
   * Parse the Url and return the base Url and query params
   * @param url - Url string
   * @param options - query parser options
   */
  parse: (url: string, { parseOptions }: Partial<UrlParseOptions<ParseArgs>> = {}) => {
    const parseArgs = merge([], options.parseOptions, parseOptions);
    return urlParse((param) => parser.parse(param, ...parseArgs))(url);
  },
  /**
   * Stringify the Url with the query param object
   *
   * **Note:** This method will `remove all` parameters from the Url and replace them with the query params defined in `query` argument
   *
   * @param url - Url string | UrlWithQueryParams
   * @param query - query params object
   */
  stringify: (
    url: string,
    query: QueryParamsObject,
    { stringifyOptions }: Partial<UrlStringifyOptions<StringifyArgs>> = {}
  ) => {
    const stringifyArgs = merge([], options.stringifyOptions, stringifyOptions);
    return urlStringify((param) => parser.stringify(param, ...stringifyArgs))(url, query);
  },
  /**
   * Update the query params of the Url
   * @param url - Url string | UrlWithQueryParams
   */
  update: (
    url: string | UrlWithQueryParams,
    query: QueryParamsObject,
    { parseOptions, queryMerger = merge }: Partial<UrlUpdateOptions<ParseArgs>> = {}
  ) => {
    const parseArgs = merge([], options.parseOptions, parseOptions);
    return urlUpdate((param) => parser.parse(param, ...parseArgs))(url, query, {
      queryMerger
    });
  }
});
