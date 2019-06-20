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
    * [.validate(item, [path])](#Schema+validate) ⇒ [<code>Array.&lt;SchemaError&gt;</code>](#SchemaError)
    * [.enforce(item, [path], [replace])](#Schema+enforce) ⇒ [<code>Array.&lt;SchemaError&gt;</code>](#SchemaError)
    * [.eachRule(callback)](#Schema+eachRule)


<br><a name="new_Schema_new"></a>

#### new Schema(schema)
> Schema enforcement.


| Param | Type |
| --- | --- |
| schema | [<code>SchemaType</code>](#SchemaType) | 

**Example**  
``` javascript

<br><a name="Schema+validate"></a>

#### schema.validate(item, [path]) ⇒ [<code>Array.&lt;SchemaError&gt;</code>](#SchemaError)
> Validate an item against the schema


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>Object</code> |  |  |
| [path] | <code>Array</code> | <code>[]</code> | If provided then only the value at that path will be validated |


<br><a name="Schema+enforce"></a>

#### schema.enforce(item, [path], [replace]) ⇒ [<code>Array.&lt;SchemaError&gt;</code>](#SchemaError)
> Enforce an items structure against the schema. This function mutates the original item.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>Object</code> |  |  |
| [path] | <code>Array</code> | <code>[]</code> |  |
| [replace] | <code>\*</code> |  | If the current value at path is invalid, replace it with this. |


<br><a name="Schema+eachRule"></a>

#### schema.eachRule(callback)
> Calls a callback for each rule that will be used to validate this schema.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Provides two args: the path and the rule. If true is returned then no more callbacks will happen further down this branch, but will continue up a level. |


<br><a name="SchemaError"></a>

### SchemaError : <code>Object</code>
> Schema validation errors


| Param | Type | Description |
| --- | --- | --- |
| error | <code>String</code> | A message about the type of error |
| path | <code>String</code> | The path within the given item to the value causing the error |
| value | <code>\*</code> | The value at this path |
| item | <code>\*</code> | The original item being validated |


<br><a name="SchemaType"></a>

### SchemaType : <code>\*</code> \| <code>Object</code>
> Schema type definitions.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>\*</code>, <code>Array</code> |  | Supported native types are Array, Boolean, Date, Element, Function, Number, Object, RegExp, String. Also supports '*', 'integer', 'float', Enum (from type-enforcer), and custom constructors (classes or constructor functions). |
| [isRequired] | <code>Boolean</code> | <code>false</code> | Empty arrays or objects that aren't required will be removed by schema.enforce(). |
| [default] | <code>Boolean</code> |  | If isRequired is true, then schema.enforce() will set this value if the key is undefined. |
| [coerce] | <code>Boolean</code> | <code>false</code> | If true then values that can be coerced into the specified type will not return errors and will be coerced in schema.enforce(). |
| [min] | <code>Number</code> |  | For Number, 'integer', and 'float' |
| [max] | <code>Number</code> |  | For Number, 'integer', and 'float' |
| [minLength] | <code>Number</code> |  | For Arrays and Strings |
| [maxLength] | <code>Number</code> |  | For Arrays and Strings |
| [clamp] | <code>Boolean</code> | <code>false</code> | Works with min, max, minength, and maxLength. If true then values outside the range will be forced within the range. If false then values outside the range will be deleted. |
| [enum] | <code>Enum</code> |  | If type is Enum, then this is required |
| [content] | <code>Object</code>, <code>Array</code> |  | For arrays and objects to specify further content |
| [enforce] | <code>function</code> |  | This is automatically included, but can be overridden. (See [type-enforcer enforce](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/enforce.md) for more info) |
| [check] | <code>function</code> |  | This is automatically included, but can be overridden. (See [type-enforcer checks](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/checks.md) for more info) |

**Example**  
``` javascript

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