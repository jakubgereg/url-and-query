# Url and Query

This package provides utility functions for handling query parameters in URLs. It is particularly useful for updating, extracting, and manipulating query parameters in a URL.

## Installation

Install the package using npm:

```bash
npm install url-and-query
```

Install your favorite query parser:

```bash
npm install qs
```

## Usage

```js
import qs from 'qs';
import { defineURL } from 'url-and-query';

const url = defineURL(qs);
```

## Examples

### parse

```js
const { baseUrl, queryParams } = url.parse('/example/path?param1=value1&param2=value2');
console.log(baseUrl, queryParams);
// Output: '/example/path', { param1: 'value1', param2: 'value2' }
```

### stringify

```js
const newURL = url.stringify('/example/path', { param1: 'value1', param2: 'value2' });
console.log(newURL);
// Output: '/example/path?param1=value1&param2=value2'
```

### update

```js
const updatedURL = url.update('/example/path?param1=old', {
  param1: 'new'
});
console.log(updatedURL);
// Output: { baseUrl: '/example/path', queryParams: { param1: 'new' } }
```

## Customization

The **queryString** library that you choose empowers you with the flexibility to customize the _parsing_ and _stringifying_ of URLs to suit your specific needs. By inheriting the options of the chosen parser, this library allows you to conveniently set it once using `defineURL` and apply it consistently whenever you _parse_ or _stringify_ your URLs.

### defineURL(_parser_, _options_)

Easily construct URLs with customizable options for the `stringify()` and `parse()` methods using `defineURL()` factory.

### Parameters

- `parser`: An object representing the used parser for parsing query parameters.
- `options`: An optional object with the following properties:
  - `stringifyOptions`: An array of options to pass into the `stringify()` method.
  - `parseOptions`: An array of options to pass into the `parse()` method.

### Example

```js
const url = defineURL(qs, {
  stringifyOptions: [{ skipNulls: true }],
  parseOptions: [{ allowDots: true }]
});
```

Parse url with option **{ allowDots: true }**

```js
url.parse('myUrl.com?color.is=red&test=passed');
//Output: 'myUrl.com', { 'color.is': 'red', test: 'passed' }
```

Stringify url with option **{ skipNulls: true }**

```js
url.stringify('myUrl.com', { a: 1, b: null });
//Output: 'myUrl.com?a=1'
```

### Override default settings

You have the flexibility to override the default settings for your parser or stringifier by providing a configuration to the respective parse/stringify method.

### Example

Consider example `defineURL` from above with `parseOptions: [{ allowDots: true }]`.

You are able to override `parseOptions` on the spot by supplying additional parameter to `parse` method

```js
// Overriding parseOptions on the spot to disallow dots
url.parse('myUrl.com?color.is=red&test=passed', {
  parseOptions: [{ allowDots: false }]
});
//Output: 'myUrl.com', { 'color.is': 'red', test: 'passed' }
```
