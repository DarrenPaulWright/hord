# Hord

> A data storage and manipulation library for javascript
>
> [![npm][npm]][npm-url]
[![build][build]][build-url]
[![coverage][coverage]][coverage-url]
[![deps][deps]][deps-url]
[![size][size]][size-url]
[![vulnerabilities][vulnerabilities]][vulnerabilities-url]
[![license][license]][license-url]


<br><a name="compare"></a>

### compare([paths]) ⇒ <code>function</code>
> Returns a function that compares two values. If paths are provided, compares the values at that path on objects.> > Notes:> - Handles undefined, null, and NaN.> - Distinguishes numbers from strings.

**Returns**: <code>function</code> - Accepts two arguments to be compared. Returns -1, 0, or 1.  

| Param | Type | Description |
| --- | --- | --- |
| [paths] | <code>Array</code>, <code>String</code> | The path or paths to compare. If multiple paths are provided, then the first key is compared first, if the values are equal then the second key is compared, and so on. |

**Example**  
``` javascriptimport { compare } from 'hord';compare('id')({id: 1}, {id: 2});// => -1```

[npm]: https://img.shields.io/npm/v/hord.svg
[npm-url]: https://npmjs.com/package/hord
[build]: https://travis-ci.org/DarrenPaulWright/hord.svg?branch&#x3D;master
[build-url]: https://travis-ci.org/DarrenPaulWright/hord
[coverage]: https://coveralls.io/repos/github/DarrenPaulWright/hord/badge.svg?branch&#x3D;master
[coverage-url]: https://coveralls.io/github/DarrenPaulWright/hord?branch&#x3D;master
[deps]: https://david-dm.org/darrenpaulwright/hord.svg
[deps-url]: https://david-dm.org/darrenpaulwright/hord
[size]: https://packagephobia.now.sh/badge?p&#x3D;hord
[size-url]: https://packagephobia.now.sh/result?p&#x3D;hord
[vulnerabilities]: https://snyk.io/test/github/DarrenPaulWright/hord/badge.svg?targetFile&#x3D;package.json
[vulnerabilities-url]: https://snyk.io/test/github/DarrenPaulWright/hord?targetFile&#x3D;package.json
[license]: https://img.shields.io/github/license/DarrenPaulWright/hord.svg
[license-url]: https://npmjs.com/package/hord/LICENSE.md
