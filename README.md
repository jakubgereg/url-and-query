# Url and Query

This package provides utility functions for handling query parameters in URLs. It is particularly useful for updating, extracting, and manipulating query parameters in a URL.

## Installation

Install the package using npm:

```bash
npm install url-and-query
```

## Usage

```js
import { qsUrl, qpUrl } from 'url-and-params';
```

# Examples

## qsUrl

```js
const newURL = qsUrl('/example/path', { param1: 'value1', param2: 'value2' });
console.log(newURL);
// Output: '/example/path?param1=value1&param2=value2'
```

## qpUrl

```js
const { baseUrl, queryParams } = qpUrl('/example/path?param1=value1&param2=value2');
console.log(baseUrl, queryParams);
// Output: '/example/path', { param1: 'value1', param2: 'value2' }
```

## updateQueryParams

```js
const updatedURL = updateQueryParams('/example/path?param1=old', {
  param1: 'new'
});
console.log(updatedURL);
// Output: { baseUrl: '/example/path', queryParams: { param1: 'new' } }
```
