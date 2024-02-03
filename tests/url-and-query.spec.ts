import { mapValues, toString } from 'lodash';
import {
  addQuerySeparator,
  checkEmpty,
  extractQuery,
  hasQueryParams,
  isQueryEmpty,
  qp,
  qpUrl,
  qs,
  qsUrl,
  updateQueryParams
} from '../src/url-and-query';

const literals = { number: 1, text: 'string', boolean: true };
const literalsString = mapValues(literals, toString);

describe('qs', () => {
  it('should stringify any literals', () => {
    const result = qs(literals);
    expect(result).toEqual('number=1&text=string&boolean=true');
  });
  it('should stringify array', () => {
    const result = qs({ array: [literals, 'value'] });
    expect(result).toEqual('array[][number]=1&array[][text]=string&array[][boolean]=true&array[]=value');
  });
  it('should ignore empty arrays', () => {
    const result = qs({ emptyArray: [] });
    expect(result).toEqual('');
  });
  it('should stringify objects', () => {
    const result = qs({ testObj: literals });
    expect(result).toEqual('testObj[number]=1&testObj[text]=string&testObj[boolean]=true');
  });
  it('should stringify nested objects', () => {
    const result = qs({ testObj: { nestedObj: literals } });
    expect(result).toEqual(
      'testObj[nestedObj][number]=1&testObj[nestedObj][text]=string&testObj[nestedObj][boolean]=true'
    );
  });
  it('should stringify not stringify empty params', () => {
    const result = qs({ page: null, other: undefined, test: false });
    expect(result).toEqual('test=false');
  });
});
describe('gp', () => {
  it('should parse query params', () => {
    const result = qp('number=1&text=string&boolean=true');
    expect(result).toEqual(literalsString);
  });
  it('should stringify array', () => {
    const result = qp('array[][number]=1&array[][text]=string&array[][boolean]=true&array[]=value');
    expect(result).toEqual({ array: [literalsString, 'value'] });
  });
  it('should parse objects', () => {
    const result = qp('testObj[number]=1&testObj[text]=string&testObj[boolean]=true');
    expect(result).toEqual({ testObj: literalsString });
  });
  it('should parse nested objects', () => {
    const result = qp('testObj[nestedObj][number]=1&testObj[nestedObj][text]=string&testObj[nestedObj][boolean]=true');
    expect(result).toEqual({ testObj: { nestedObj: literalsString } });
  });
  it('should parse encoded query', () => {
    const result = qp('number%3D1%26text%3Dstring%26boolean%3Dtrue');
    expect(result).toEqual(literalsString);
  });
});
describe('qsUrl', () => {
  it('should construct url with query params', () => {
    const result = qsUrl('test.com', literals);
    expect(result).toEqual('test.com?number=1&text=string&boolean=true');
  });
  it('should append query params to existing url with query params', () => {
    const result = qsUrl('www.mypage.com/action?test=1', literals);
    expect(result).toEqual('www.mypage.com/action?test=1&number=1&text=string&boolean=true');
  });
  it("should append query to url with dangling '?'", () => {
    const result = qsUrl('www.mypage.com/action?', literals);
    expect(result).toEqual('www.mypage.com/action?&number=1&text=string&boolean=true');
  });
  it('should append query to url with encoded query', () => {
    const result = qsUrl('test.com?a%3D1%26b%3Dstring%26c%3Dtrue', literals);
    expect(result).toEqual('test.com?a=1&b=string&c=true&number=1&text=string&boolean=true');
  });
  it('should ignore empty or null params', () => {
    const result = qsUrl('test.com', { page: null, color: 'red' });
    expect(result).toEqual('test.com?color=red');
  });
});
describe('qpUrl', () => {
  it('should parse url with query params', () => {
    const result = qpUrl('test.com?number=1&text=string&boolean=true');
    expect(result.baseUrl).toEqual('test.com');
    expect(result.queryParams).toEqual(literalsString);
  });
  it('should parse url without query params', () => {
    const result = qpUrl('www.mypage.com/action?');
    expect(result.baseUrl).toEqual('www.mypage.com/action');
    expect(result.queryParams).toEqual({});
  });
  it('should parse relative url with query params', () => {
    const result = qpUrl('/action?number=1&text=string&boolean=true');
    expect(result.baseUrl).toEqual('/action');
    expect(result.queryParams).toEqual(literalsString);
  });
  it("should parse url with dangling '?'", () => {
    const result = qpUrl('test.com?&number=1&text=string&boolean=true');
    expect(result.baseUrl).toEqual('test.com');
    expect(result.queryParams).toEqual(literalsString);
  });
  it('should parse url with encoded query', () => {
    const result = qpUrl('test.com?number%3D1%26text%3Dstring%26boolean%3Dtrue');
    expect(result.baseUrl).toEqual('test.com');
    expect(result.queryParams).toEqual(literalsString);
  });
});
describe('utils', () => {
  it('checkEmpty', () => {
    expect(checkEmpty({})).toBeTruthy();
    expect(checkEmpty(undefined)).toBeTruthy();
    expect(checkEmpty(null)).toBeTruthy();
    expect(checkEmpty([])).toBeTruthy();
    expect(checkEmpty({})).toBeTruthy();
    expect(checkEmpty('')).toBeTruthy();

    expect(checkEmpty(1)).toBeFalsy();
    expect(checkEmpty([2])).toBeFalsy();
    expect(checkEmpty({ test: 1 })).toBeFalsy();
    expect(checkEmpty('string')).toBeFalsy();
    expect(checkEmpty(NaN)).toBeFalsy();
  });
  it('isQueryEmpty', () => {
    expect(isQueryEmpty({})).toBeTruthy();
    expect(isQueryEmpty({ test: undefined })).toBeTruthy();
    expect(isQueryEmpty({ one: null, second: undefined })).toBeTruthy();
    expect(isQueryEmpty({ array: [] })).toBeTruthy();
    expect(isQueryEmpty({ object: {} })).toBeTruthy();
    expect(isQueryEmpty({ text: '' })).toBeTruthy();

    expect(isQueryEmpty({ test: 1 })).toBeFalsy();
    expect(isQueryEmpty({ test: undefined, notEmpty: 'me' })).toBeFalsy();
    expect(isQueryEmpty({ one: null, second: NaN })).toBeFalsy();
    expect(isQueryEmpty({ array: ['1'] })).toBeFalsy();
    expect(isQueryEmpty({ object: { nested: {} } })).toBeFalsy();
    expect(isQueryEmpty({ text: 'string' })).toBeFalsy();
  });
  it('hasQueryParams', () => {
    expect(hasQueryParams('txt.com?')).toBeTruthy();
    expect(hasQueryParams('txt.com?a=1')).toBeTruthy();
    expect(hasQueryParams('www.some.com?number=1&text=string&boolean=true')).toBeTruthy();

    expect(hasQueryParams('www.some.com')).toBeFalsy();
    expect(hasQueryParams('www.some.com/something')).toBeFalsy();
  });
  it('addQuerySeparator', () => {
    expect(addQuerySeparator('txt.com?')).toBe('&');
    expect(addQuerySeparator('txt.com?test=1')).toBe('&');
    expect(addQuerySeparator('www.some.com/something')).toBe('?');
  });
  it('extractQuery', () => {
    expect(extractQuery('/action?')).toEqual({
      baseUrl: '/action',
      query: undefined
    });
    expect(extractQuery('txt.com/delete?test=1')).toEqual({
      baseUrl: 'txt.com/delete',
      query: 'test=1'
    });
    expect(extractQuery('www.some.com/something')).toEqual({
      baseUrl: 'www.some.com/something',
      query: undefined
    });
  });
  it('updateQueryParams', () => {
    expect(
      updateQueryParams('txt.com/delete?test=1&color=blue', {
        color: 'red',
        page: 2
      })
    ).toEqual({
      baseUrl: 'txt.com/delete',
      queryParams: { color: 'red', page: 2, test: '1' }
    });
    expect(updateQueryParams('txt.com/edit?page=1', { color: 'black', skip: true })).toEqual({
      baseUrl: 'txt.com/edit',
      queryParams: { color: 'black', page: '1', skip: true }
    });
    expect(updateQueryParams('txt.com/edit?page=1', { page: null })).toEqual({
      baseUrl: 'txt.com/edit',
      queryParams: { page: null }
    });
  });
});
