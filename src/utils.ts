import { isObject, isString, isEmpty, isNil, values } from 'lodash';
import { QueryParamsObject, UrlWithQueryParams } from './types';

export const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

export const extractQuery = (
  url: string | Pick<UrlWithQueryParams, 'baseUrl'>,
  { trimBaseUrlTrailingSlash }: Partial<{ trimBaseUrlTrailingSlash: boolean }> = {}
) => {
  const _url = isString(url) ? url : url.baseUrl;
  const [baseUrl, queryString] = _url.split('?');
  return {
    baseUrl: trimBaseUrlTrailingSlash ? trimTrailingSlash(baseUrl) : baseUrl,
    queryString: queryString || undefined
  };
};
export const checkEmpty = (value: any) => (isObject(value) || isString(value) ? isEmpty(value) : isNil(value));
export const isQueryEmpty = (query: QueryParamsObject) => values(query).every(checkEmpty);
