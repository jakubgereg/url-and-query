import { merge } from 'lodash';

// interface QueryStringLibrary<StringifyArgs extends any, ParseArgs extends any> {
//   parse: (str: string, ...args: ParseArgs[]) => any;
//   stringify: (obj: any, ...args: StringifyArgs[]) => string;
// }

// const createInstance = <StringifyArgs extends any, ParseArgs extends any>(
//   parser: QueryStringLibrary<StringifyArgs, ParseArgs>,
//   options?: {
//     stringifyOptions?: StringifyArgs[];
//     parseOptions?: ParseArgs[];
//   }
// ) => {
//   const { stringifyOptions = [], parseOptions = [] } = options || {};
//   return {
//     stringify: (obj: any, ...args: StringifyArgs[]) => parser.stringify(obj, ...merge([], stringifyOptions, args)),
//     parse: (str: string, ...args: ParseArgs[]) => parser.parse(str, ...merge([], parseOptions, args))
//   };
// };

// const instance = createInstance(qs, { stringifyOptions: [{ skipNulls: false, addQueryPrefix: true }] });

// const conf = instance.stringify({ a: 1, b: null }, { skipNulls: true, addQueryPrefix: false });
// const noCOnf = instance.stringify({ a: 1, b: null });

// // { conf: 'a=1', noCOnf: 'a=1&b=' }
// console.log({ conf, noCOnf });

import qs from 'qs';
import { defineURL } from './url-and-query';

const instance = defineURL(qs, { stringifyOptions: [{ skipNulls: false, addQueryPrefix: true }] });

const conf = instance.stringify('test', { a: 1, b: null }, { skipNulls: true, addQueryPrefix: false });
const noCOnf = instance.stringify('test', { a: 1, b: null });

// instance.update('test', { a: 1, b: null }, { mergeQuery: merge});

const parsed1 = instance.parse('test?color.is=red', { allowDots: true });

// { conf: 'a=1', noCOnf: 'a=1&b=' }
console.log(parsed1.queryParams);
console.log({ conf, noCOnf, parsed1 });
