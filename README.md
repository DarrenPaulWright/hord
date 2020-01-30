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

<br><a name="Installation"></a>

## Installation
```
npm install hord
```
_Requires Babel 7.2+_


<br>

## Classes

<dl>
<dt><a href="docs/Collection.md">Collection</a> ⇐ <code>Array</code></dt>
<dd><p>An array of objects with optional model enforcement and indexed queries.</p>
</dd>
<dt><a href="docs/List.md">List</a></dt>
<dd><p>Always sorted array.</p>
</dd>
<dt><a href="docs/Model.md">Model</a></dt>
<dd><p>Data models with automatic schema enforcement.</p>
</dd>
<dt><a href="docs/Schema.md">Schema</a></dt>
<dd><p>Schema enforcement.</p>
</dd>
</dl>

<br>

## Functions

<dl>
<dt><a href="docs/compare.md">compare([paths], [desc])</a> ⇒ <code>function</code></dt>
<dd><p>Returns a function that compares two values. If paths are provided, compares the values at that path on objects.</p>
<p>Notes:</p>
<ul>
<li>Handles undefined, null, and NaN.</li>
<li>Distinguishes numbers from strings.</li>
</ul>
</dd>
</dl>

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
