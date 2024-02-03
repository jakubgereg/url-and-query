import { mapValues, merge, toString } from 'lodash';
import { defineUrlInstance } from '../src/url-and-query';

import qs from 'qs';

const literals = { number: 1, text: 'string', boolean: true };
const literalsString = mapValues(literals, toString);

const {
  parse: urlParse,
  stringify: urlStringify,
  update: urlQueryUpdate
} = defineUrlInstance({
  queryString: {
    parse: (str) => qs.parse(decodeURIComponent(str)),
    stringify: (query) => qs.stringify(query, { encode: false, skipNulls: true, arrayFormat: 'brackets' })
  }
});

describe('urlStringify', () => {
  it('should construct url with query params', () => {
    const result = urlStringify('test.com', literals);
    expect(result).toEqual('test.com?number=1&text=string&boolean=true');
  });
  it('should override existing query params', () => {
    const result = urlStringify('www.mypage.com/action?number=33', literals);
    expect(result).toEqual('www.mypage.com/action?number=1&text=string&boolean=true');
  });
  it("should append query to url with dangling '?'", () => {
    const result = urlStringify('www.mypage.com/action?', literals);
    expect(result).toEqual('www.mypage.com/action?number=1&text=string&boolean=true');
  });
  it('should remove all parameters from original url', () => {
    const result = urlStringify('www.mypage.com/?a%3D1%26b%3Dstring%26c%3Dtrue', {});
    expect(result).toEqual('www.mypage.com/');
  });
  it('should ignore empty or null params', () => {
    const result = urlStringify('test.com', { page: null, color: 'red' });
    expect(result).toEqual('test.com?color=red');
  });
  it('should handle trailing slash', () => {
    const result = urlStringify('test.com/', { page: 1 }, { removeTrailingSlash: true });
    expect(result).toEqual('test.com?page=1');
  });
  it('should handle arrays', () => {
    const result = urlStringify('test.com', { tests: [1, 2, 3], colors: ['red', 'blue'] });
    expect(result).toEqual('test.com?tests[]=1&tests[]=2&tests[]=3&colors[]=red&colors[]=blue');
  });
});

describe('urlParse', () => {
  it('should parse url with query params', () => {
    const result = urlParse('test.com?number=1&text=string&boolean=true');
    expect(result.baseUrl).toEqual('test.com');
    expect(result.queryParams).toEqual(literalsString);
  });
  it('should parse url without query params', () => {
    const result = urlParse('www.mypage.com/action?');
    expect(result.baseUrl).toEqual('www.mypage.com/action');
    expect(result.queryParams).toEqual({});
  });
  it('should parse relative url with query params', () => {
    const result = urlParse('/action?number=1&text=string&boolean=true');
    expect(result.baseUrl).toEqual('/action');
    expect(result.queryParams).toEqual(literalsString);
  });
  it("should parse url with dangling '?'", () => {
    const result = urlParse('test.com?&number=1&text=string&boolean=true');
    expect(result.baseUrl).toEqual('test.com');
    expect(result.queryParams).toEqual(literalsString);
  });
  it('should parse url with encoded query', () => {
    const result = urlParse('test.com?number%3D1%26text%3Dstring%26boolean%3Dtrue');
    expect(result.baseUrl).toEqual('test.com');
    expect(result.queryParams).toEqual(literalsString);
  });
});

describe('urlQueryUpdate', () => {
  it('should update and replace color query param', () => {
    const result = urlQueryUpdate('txt.com/delete?test=1&color=blue', {
      color: 'red',
      page: 2
    });
    expect(result).toEqual({
      baseUrl: 'txt.com/delete',
      queryParams: { color: 'red', page: 2, test: '1' }
    });
  });
  it('should merge query params correctly', () => {
    const result = urlQueryUpdate('txt.com/edit?page=1', { color: 'black', skip: true });
    expect(result).toEqual({
      baseUrl: 'txt.com/edit',
      queryParams: { color: 'black', page: '1', skip: true }
    });
  });
  it('should reset query param to null', () => {
    const result = urlQueryUpdate('txt.com/edit?page=1', { page: null });
    expect(result).toEqual({
      baseUrl: 'txt.com/edit',
      queryParams: { page: null }
    });
  });
  it('should handle different mergeQuery strategy', () => {
    const result = urlQueryUpdate(
      'txt.com/edit?page=1&test=true',
      { page: null, count: 5 },
      { mergeQuery: (old, newQuery) => merge(newQuery, old) }
    );
    expect(result).toEqual({
      baseUrl: 'txt.com/edit',
      queryParams: { page: '1', test: 'true', count: 5 }
    });
  });
  it('should handle empty query params', () => {
    const result = urlQueryUpdate('txt.com/edit', { page: 2 });
    expect(result).toEqual({
      baseUrl: 'txt.com/edit',
      queryParams: { page: 2 }
    });
  });
  it('should handle url with encoded query', () => {
    const result = urlQueryUpdate('txt.com?a%3D1%26b%3Dstring%26c%3Dtrue', literals);
    expect(result).toEqual({
      baseUrl: 'txt.com',
      queryParams: { a: '1', b: 'string', c: 'true', number: 1, text: 'string', boolean: true }
    });
  });
});
