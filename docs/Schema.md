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

## Schema
> Schema enforcement.


* [Schema](#Schema)
    * [new Schema(schema)](#new_Schema_new)
    * [.validate(item, [path])](#Schema+validate) ⇒ [<code>Array.&lt;SchemaError&gt;</code>](#SchemaError)
    * [.enforce(item, [path], [replace])](#Schema+enforce) ⇒ [<code>Array.&lt;SchemaError&gt;</code>](#SchemaError)
    * [.eachRule(callback)](#Schema+eachRule)
    * [.extend(schema)](#Schema+extend) ⇒ [<code>Schema</code>](#Schema)


<br><a name="new_Schema_new"></a>

### new Schema(schema)

| Param | Type |
| --- | --- |
| schema | [<code>SchemaDefinition</code>](#SchemaDefinition) | 

**Example**  
``` javascript
import { Schema } from 'hord';

const person = new Schema({
 first: String,
 last: String,
 age: 'integer',
 hobbies: {
     type: Array,
     content: String
 }
});

person.validate({
 first: 'John',
 last: 'Doe',
 age: 21
});
// => []
```

<br><a name="Schema+validate"></a>

### schema.validate(item, [path]) ⇒ [<code>Array.&lt;SchemaError&gt;</code>](#SchemaError)
> Validate an item against the schema.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>object</code> |  | The object validate against this schema. |
| [path] | <code>Array</code> | <code>[]</code> | If provided then only the value at that path will be validated. |


<br><a name="Schema+enforce"></a>

### schema.enforce(item, [path], [replace]) ⇒ [<code>Array.&lt;SchemaError&gt;</code>](#SchemaError)
> Enforce an items structure against the schema. This function mutates the original item.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>object</code> |  | The object enforce against this schema. |
| [path] | <code>Array</code> | <code>[]</code> | If provided then only the value at that path will be enforced. |
| [replace] | <code>unknown</code> |  | If the current value at path is invalid, replace it with this. |


<br><a name="Schema+eachRule"></a>

### schema.eachRule(callback)
> Calls a callback for each rule that will be used to validate this schema.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Provides two args: the path and the rule. If true is returned then no more callbacks will happen further down this branch, but will continue up a level. |


<br><a name="Schema+extend"></a>

### schema.extend(schema) ⇒ [<code>Schema</code>](#Schema)
> Returns a new Schema with the rules from the provided schema [superimposed](https://github.com/DarrenPaulWright/object-agent/blob/master/docs/superimpose.md) on the rules from this schema. If no args are provided, then the returned Schema is effectively a clone of this one.


| Param | Type | Description |
| --- | --- | --- |
| schema | [<code>SchemaDefinition</code>](#SchemaDefinition), [<code>Schema</code>](#Schema) | The schema to superimpose on this one. |


<br><a name="SchemaError"></a>

## SchemaError : <code>object</code>
> Schema validation errors


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | A message about the type of error |
| path | <code>string</code> | The path within the given item to the value causing the error |
| value | <code>unknown</code> | The value at this path |
| item | <code>unknown</code> | The original item being validated |


<br><a name="SchemaDefinition"></a>

## SchemaDefinition : <code>\*</code> \| <code>object</code>
> Schema type definitions. Can be just the type as defined below, or an array of types, or an object with the following options. Any extra options provided will be copied to the rule, which can be accessed via the schema.eachRule() method.
> 
> '*' can be used as a key to indicate that any keys are allowed in an object.

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>\*</code> \| <code>Array</code> |  | Supported native types are Array, Boolean, Date, Element, Function, Number, Object, RegExp, String. Also supports '*', 'integer', 'float', Enum (from type-enforcer), custom constructors (classes or constructor functions), or instances of Schema or Model. |
| [isRequired] | <code>boolean</code> | <code>false</code> | Empty arrays or objects that aren't required will be removed by schema.enforce(). |
| [default] | <code>boolean</code> |  | If isRequired is true, then schema.enforce() will set this value if the key is undefined. |
| [coerce] | <code>boolean</code> | <code>false</code> | If true then values that can be coerced into the specified type will not return errors and will be coerced in schema.enforce(). |
| [min] | <code>number</code> |  | For Number, 'integer', and 'float' |
| [max] | <code>number</code> |  | For Number, 'integer', and 'float' |
| [minLength] | <code>number</code> |  | For Arrays and Strings |
| [maxLength] | <code>number</code> |  | For Arrays and Strings |
| [clamp] | <code>boolean</code> | <code>false</code> | Works with min, max, minength, and maxLength. If true then values outside the range will be forced within the range. If false then values outside the range will be deleted. |
| [enum] | <code>Enum</code> |  | If type is Enum, then this is required |
| [content] | <code>object</code> \| <code>Array</code> |  | For arrays and objects to specify further content |
| [enforce] | <code>function</code> |  | This is automatically included, but can be overridden. (See [type-enforcer enforce](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/enforce.md) for more info) |
| [check] | <code>function</code> |  | This is automatically included, but can be overridden. (See [type-enforcer checks](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/checks.md) for more info) |

**Example**  
``` javascript
import { Schema } from 'hord';

// Can be a native type or string
const person = new Schema({
 first: String,
 last: String,
 age: 'integer'
});

// Or with options:
const person = new Schema({
 first: {
     type: String,
     isRequired: true
 },
 last: {
     type: String,
     isRequired: true
 },
 age: {
     type: 'integer'
     min: 0,
     coerce: true
 }
});
```

[npm]: https://img.shields.io/npm/v/hord.svg
[npm-url]: https://npmjs.com/package/hord
[build]: https://travis-ci.org/DarrenPaulWright/hord.svg?branch&#x3D;master
[build-url]: https://travis-ci.org/DarrenPaulWright/hord
[coverage]: https://coveralls.io/repos/github/DarrenPaulWright/hord/badge.svg?branch&#x3D;master
[coverage-url]: https://coveralls.io/github/DarrenPaulWright/hord?branch&#x3D;master
[deps]: https://david-dm.org/DarrenPaulWright/hord.svg
[deps-url]: https://david-dm.org/DarrenPaulWright/hord
[size]: https://packagephobia.now.sh/badge?p&#x3D;hord
[size-url]: https://packagephobia.now.sh/result?p&#x3D;hord
[vulnerabilities]: https://snyk.io/test/github/DarrenPaulWright/hord/badge.svg?targetFile&#x3D;package.json
[vulnerabilities-url]: https://snyk.io/test/github/DarrenPaulWright/hord?targetFile&#x3D;package.json
[license]: https://img.shields.io/github/license/DarrenPaulWright/hord.svg
[license-url]: https://npmjs.com/package/hord/LICENSE.md
