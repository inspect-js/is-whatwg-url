# is-whatwg-url <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

Is this value a WHATWG-standard URL object?

## Example

```js
const assert = require('assert');
const isURL = require('is-whatwg-url');

const url = new URL('about:blank');

assert.equal(isURL(url), true);
assert.equal(isURL(Object.assign({ constructor: URL, __proto__: URL.prototype }, url)), false);
```

## native engine version support matrix

| Engine  | :white_check_mark: toString and/or getters brand check | :warning: non-standard URLContext Symbol property<br /><sub>(no brand check)</sub> | :warning: no methods<br /><sub>(no brand check)</sub> | :x: non-constructor `URL` | :x: no `URL` |
| ------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------- | ------------ |
| chrome  | >= 32                                                  |                                                                                    | 23 - 31                                               |                           | <= 22        |
| safari  | >= 6.2                                                 |                                                                                    |                                                       |                           | <= 6.1       |
| firefox | >= 26                                                  |                                                                                    |                                                       | 4 - 25                    | <= 3.6       |
| node    | >= 20                                                  | 6 - 20                                                                             |                                                       |                           | < 6          |

## Caveats:
 - firefox 26 - 28: toString does not brand check, but accessors do
 - chrome 32-44, firefox 26+, node 20.0 - 20.11: the error message is bad/unclear/inaccurate, but a TypeError is correctly thrown
 - node from v6 - 20, inclusive, does not properly brand check, but instead looks for a URLContext object appearing behind a public non-global symbol (`Object.getOwnPropertySymbols(new URL('about:blank'))[0]`). As such, this library uses the most rigorous heuristics possible to determine if something is a URL.
   - node v6 - v18.16, inclusive, also looks for public non-global symbol (`Object.getOwnPropertySymbols(new URL('about:blank'))[1]`). property that is the same value as `.searchParams` on the URL instance
 - prior to node v10.0, `URL` was not a global, but is accessible with `require('url').URL`

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/is-whatwg-url
[npm-version-svg]: https://versionbadg.es/inspect-js/is-whatwg-url.svg
[deps-svg]: https://david-dm.org/inspect-js/is-whatwg-url.svg
[deps-url]: https://david-dm.org/inspect-js/is-whatwg-url
[dev-deps-svg]: https://david-dm.org/inspect-js/is-whatwg-url/dev-status.svg
[dev-deps-url]: https://david-dm.org/inspect-js/is-whatwg-url#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/is-whatwg-url.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/is-whatwg-url.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/is-whatwg-url.svg
[downloads-url]: https://npm-stat.com/charts.html?package=is-whatwg-url
[codecov-image]: https://codecov.io/gh/inspect-js/is-whatwg-url/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/inspect-js/is-whatwg-url/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/inspect-js/is-whatwg-url
[actions-url]: https://github.com/inspect-js/is-whatwg-url/actions
