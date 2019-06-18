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


<br><a name="Schema"></a>

### Schema

* [Schema](#Schema)
    * [new Schema(schema)](#new_Schema_new)
    * [.validate(item)](#Schema+validate) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.enforce(item)](#Schema+enforce) ⇒ <code>Object</code>
    * [.eachRule(callback)](#Schema+eachRule)


<br><a name="new_Schema_new"></a>

#### new Schema(schema)
> Schema enforcement.


| Param | Type |
| --- | --- |
| schema | <code>Object</code> | 

**Example**  
``` javascriptimport { Schema } from 'type-enforcer';const person = new Schema({ first: String, last: String, age: 'integer', hobbies: {     type: Array,     content: String }});person.validate({ first: 'John', last: 'Doe', age: 21});// => []```

<br><a name="Schema+validate"></a>

#### schema.validate(item) ⇒ <code>Array.&lt;Object&gt;</code>
> Validate an item against the schema

**Returns**: <code>Array.&lt;Object&gt;</code> - An array of error objects. Each object contains: "error" - A message about the type of error, "path" - The path within the given item to the value causing the error, "value" - The value at this path, "item" -  The original item being validated  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 


<br><a name="Schema+enforce"></a>

#### schema.enforce(item) ⇒ <code>Object</code>
> Enforce an items structure against the schema. This function mutates the original item.

**Returns**: <code>Object</code> - The enforced item  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 


<br><a name="Schema+eachRule"></a>

#### schema.eachRule(callback)
> Calls a callback for each rule that will be used to validate this schema.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Provides two args: the path and the rule. If true is returned then no more callbacks will happen further down this branch, but will continue up a level. |


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
