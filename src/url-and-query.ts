import { isString, merge } from 'lodash';
import { QueryParamsObject, URLWithQueryParams } from './types';
import { extractQuery, isQueryEmpty } from './utils';

export interface QueryStringLibrary<StringifyArgs extends any, ParseArgs extends any> {
  parse: (url: string, ...args: ParseArgs[]) => QueryParamsObject;
  stringify: (query: QueryParamsObject, ...args: StringifyArgs[]) => string;
}
export interface QueryParserOptions<ParseArgs extends any> {
  parse: QueryStringLibrary<unknown, ParseArgs>['parse'];
}

export interface QueryStringifyOptions<StringifyArgs extends any> {
  stringify: QueryStringLibrary<StringifyArgs, unknown>['stringify'];
}

export interface QueryUpdateOptions<ParseArgs extends any> extends QueryParserOptions<ParseArgs> {
  queryMerger?: (oldQuery: QueryParamsObject, newQuery: QueryParamsObject) => QueryParamsObject;
}

const urlStringify = <StringifyArgs extends any>(
  url: string,
  query: QueryParamsObject,
  { stringify }: QueryStringifyOptions<StringifyArgs>
) => {
  const { baseUrl } = extractQuery(url);
  const queryString = stringify(query);
  return isQueryEmpty(query) ? baseUrl : `${baseUrl}${queryString.startsWith('?') ? queryString : `?${queryString}`}`;
};

const urlParse = <ParseArgs extends any>(
  url: string | Omit<URLWithQueryParams, 'queryParams'>,
  { parse }: QueryParserOptions<ParseArgs>
): URLWithQueryParams => {
  const { baseUrl, queryString } = extractQuery(url);
  return {
    baseUrl: baseUrl,
    queryParams: queryString ? parse(queryString) : {}
  };
};

const urlQueryUpdate = <ParseArgs extends any>(
  url: string | URLWithQueryParams,
  query: QueryParamsObject,
  { parse, queryMerger = merge }: QueryUpdateOptions<ParseArgs>
): URLWithQueryParams => {
  const { baseUrl, queryParams } = isString(url) ? urlParse(url, { parse }) : url;

  return {
    baseUrl: baseUrl,
    queryParams: queryMerger(queryParams, query)
  };
};

/**
 * Define a new instance of URL parser and query stringifier
 * @param options - query string library and base url options
 * @returns instance with parse, stringify and update methods
 */
export const defineURL = <StringifyArgs extends any, ParseArgs extends any>(
  parser: QueryStringLibrary<StringifyArgs, ParseArgs>,
  options?: Partial<{
    stringifyOptions: StringifyArgs[];
    parseOptions: ParseArgs[];
  }>
) => ({
  /**
   * Parse the URL and return the base URL and query params
   * @param url - URL string
   * @param options - query parser options
   */
  parse: (
    url: string | Omit<URLWithQueryParams, 'queryParams'>,
    {
      parserOptions
    }: Partial<{
      parserOptions: ParseArgs[];
    }> = {}
  ) => {
    const defaultOptions = options || {};
    const parseArgs = merge([], defaultOptions.parseOptions, parserOptions);
    return urlParse(url, {
      parse: (url) => parser.parse(url, ...parseArgs)
    });
  },
  /**
   * Stringify the URL with the query param object
   *
   * **Note:** This method will `remove all` parameters from the URL and replace them with the query params defined in `query` argument
   *
   * @param url - URL string | URLWithQueryParams
   * @param query - query params object
   */
  stringify: (url: string, query: QueryParamsObject, ...args: StringifyArgs[]) => {
    const { stringifyOptions = [] } = options || {};
    const stringifyArgs = merge([], stringifyOptions, args);
    return urlStringify(url, query, { stringify: (query) => parser.stringify(query, ...stringifyArgs) });
  },
  /**
   * Update the query params of the URL
   * @param url - URL string | URLWithQueryParams
   */
  update: (
    url: string | URLWithQueryParams,
    query: QueryParamsObject,
    {
      parserOptions,
      queryMerger = merge
    }: Partial<{
      parserOptions: ParseArgs[];
      queryMerger: QueryUpdateOptions<ParseArgs>['queryMerger'];
    }> = {}
  ) => {
    const { parseOptions = [] } = options || {};
    const parseArgs = merge([], parseOptions, parserOptions);
    return urlQueryUpdate(url, query, {
      parse: (url) => parser.parse(url, ...parseArgs),
      queryMerger
    });
  }
});
