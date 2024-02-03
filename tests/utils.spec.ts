import { checkEmpty, isQueryEmpty, extractQuery } from '../src/utils';

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
  it('extractQuery', () => {
    expect(extractQuery('/action?')).toEqual({
      baseUrl: '/action',
      queryString: undefined
    });
    expect(extractQuery('txt.com/delete?test=1')).toEqual({
      baseUrl: 'txt.com/delete',
      queryString: 'test=1'
    });
    expect(extractQuery('www.some.com/something')).toEqual({
      baseUrl: 'www.some.com/something',
      queryString: undefined
    });
  });
});
