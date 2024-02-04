# Url and Query

This package provides utility functions for handling query parameters in URLs. It is particularly useful for updating, extracting, and manipulating query parameters in a URL.

## Installation

Install the package using npm:

```bash
npm install url-and-query
```

Install your favourite query parser

```bash
npm install qs
```

## Usage

```js
import { qs } from 'qs';
import { defineURL } from 'url-and-query';

const url = defineURL(qs);
```

# Examples

## parse

```js
const { baseUrl, queryParams } = url.parse('/example/path?param1=value1&param2=value2');
console.log(baseUrl, queryParams);
// Output: '/example/path', { param1: 'value1', param2: 'value2' }
```

## stringify

```js
const newURL = url.stringify('/example/path', { param1: 'value1', param2: 'value2' });
console.log(newURL);
// Output: '/example/path?param1=value1&param2=value2'
```

## update

```js
const updatedURL = url.update('/example/path?param1=old', {
  param1: 'new'
});
console.log(updatedURL);
// Output: { baseUrl: '/example/path', queryParams: { param1: 'new' } }
```
