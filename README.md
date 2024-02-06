# Url and Query

This package provides utility functions for handling query parameters in Urls. It is particularly useful for updating, extracting, and manipulating query parameters in a Url.

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
import { defineUrl } from 'url-and-query';

const url = defineUrl(qs);
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
const newUrl = url.stringify('/example/path', { param1: 'value1', param2: 'value2' });
console.log(newUrl);
// Output: '/example/path?param1=value1&param2=value2'
```

### update

```js
const updatedUrl = url.update('/example/path?param1=old', {
  param1: 'new'
});
console.log(updatedUrl);
// Output: { baseUrl: '/example/path', queryParams: { param1: 'new' } }
```

## Customization

The **queryString** library that you choose empowers you with the flexibility to customize the _parsing_ and _stringifying_ of Urls to suit your specific needs. By inheriting the options of the chosen parser, this library allows you to conveniently set it once using `defineUrl` and apply it consistently whenever you _parse_ or _stringify_ your Urls.

### defineUrl(_parser_, _options_)

Easily construct Urls with customizable options for the `stringify()` and `parse()` methods using `defineUrl()` factory.

### Parameters

- `parser`: An object representing the used parser for parsing query parameters.
- `options`: An optional object with the following properties:
  - `stringifyOptions`: An array of options to pass into the `stringify()` method.
  - `parseOptions`: An array of options to pass into the `parse()` method.

### Example

```js
const url = defineUrl(qs, {
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

Consider example `defineUrl` from above with `parseOptions: [{ allowDots: true }]`.

You are able to override `parseOptions` on the spot by supplying additional parameter to `parse` method

```js
// Overriding parseOptions on the spot to disallow dots
url.parse('myUrl.com?color.is=red&test=passed', {
  parseOptions: [{ allowDots: false }]
});
//Output: 'myUrl.com', { 'color.is': 'red', test: 'passed' }
```
