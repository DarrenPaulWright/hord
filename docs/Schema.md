# hord
[![npm][npm]][npm-url]
[![build][build]][build-url]
[![Coverage Status](https://coveralls.io/repos/github/DarrenPaulWright/hord/badge.svg?branch=master)](https://coveralls.io/github/DarrenPaulWright/hord?branch=master)
[![deps][deps]][deps-url]
[![size][size]][size-url]
[![Known Vulnerabilities](https://snyk.io/test/github/DarrenPaulWright/hord/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DarrenPaulWright/hord?targetFile=package.json)

A data storage and manipulation library for javascript

<a name="Schema"></a>

## Schema
**Kind**: global class  

* [Schema](#Schema)
    * [new Schema(schema)](#new_Schema_new)
    * [.validate(item)](#Schema+validate) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.enforce(item)](#Schema+enforce) ⇒ <code>Object</code>

<a name="new_Schema_new"></a>

### new Schema(schema)
Schema enforcement


| Param | Type |
| --- | --- |
| schema | <code>Object</code> | 

**Example**  
``` javascriptimport { Schema } from 'type-enforcer';const person = new Schema({ first: String, last: String, age: 'integer', hobbies: {     type: Array,     content: String }});person.validate({ first: 'John', last: 'Doe', age: 21});// => []```
<a name="Schema+validate"></a>

### schema.validate(item) ⇒ <code>Array.&lt;Object&gt;</code>
Validate an item against the schema

**Kind**: instance method of [<code>Schema</code>](#Schema)  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of error objects. Each object contains: "error" - A message about the type of error, "path" - The path within the given item to the value causing the error, "value" - The value at this path, "item" -  The original item being validated  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 

<a name="Schema+enforce"></a>

### schema.enforce(item) ⇒ <code>Object</code>
Enforce an items structure against the schema. This function mutates the original item.

**Kind**: instance method of [<code>Schema</code>](#Schema)  
**Returns**: <code>Object</code> - The enforced item  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 


## License

[MIT](LICENSE.md)

[npm]: https://img.shields.io/npm/v/hord.svg
[npm-url]: https://npmjs.com/package/hord
[build]: https://travis-ci.org/DarrenPaulWright/hord.svg?branch=master
[build-url]: https://travis-ci.org/DarrenPaulWright/hord
[deps]: https://david-dm.org/darrenpaulwright/hord.svg
[deps-url]: https://david-dm.org/darrenpaulwright/hord
[size]: https://packagephobia.now.sh/badge?p=hord
[size-url]: https://packagephobia.now.sh/result?p=hord
