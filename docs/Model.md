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


<br><a name="Model"></a>

### Model

* [Model](#Model)
    * [new Model(schema)](#new_Model_new)
    * _instance_
        * [.schema](#Model+schema) ⇒ <code>Schema</code>
        * [.apply(object)](#Model+apply) ⇒ <code>Object</code>
        * [.extend(model)](#Model+extend) ⇒ [<code>Model</code>](#Model)
        * [.errorLevel(errorLevel)](#Model+errorLevel) ⇒ [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL)
        * [.onChange(callback)](#Model+onChange) ⇒ <code>Queue</code>
        * [.onError(callback)](#Model+onError) ⇒ <code>Queue</code>
    * _static_
        * [.defaultErrorLevel(errorLevel)](#Model.defaultErrorLevel) ⇒ [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL)


<br><a name="new_Model_new"></a>

#### new Model(schema)
> Models with automatic schema enforcement. Once the Model is instantiated the schema can't be changed.> > The Model class uses the [on-change](https://github.com/sindresorhus/on-change) library (uses the [`Proxy` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)) to detect changes and enforce the schema.


| Param | Type |
| --- | --- |
| schema | <code>Schema</code> | 

**Example**  
``` javascriptimport { Model } from 'type-enforcer';const Person = new Model({ first: String, last: String, age: 'integer', hobbies: {     type: Array,     content: String }});const johnDoe = Person.apply({ first: 'John', last: 'Doe', age: 21});johnDoe.hobbies = ['programming', 10];console.log(johnDoe);// => { first: 'John', last: 'Doe', age: 21, hobbies: ['programming'] }```

<br><a name="Model+schema"></a>

#### model.schema ⇒ <code>Schema</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔒 Read only`_

> Get the schema for this model


<br><a name="Model+apply"></a>

#### model.apply(object) ⇒ <code>Object</code>
> Apply this model to an object


| Param | Type |
| --- | --- |
| object | <code>Object</code> | 


<br><a name="Model+extend"></a>

#### model.extend(model) ⇒ [<code>Model</code>](#Model)
> Returns a new Model with a new [extended](docs/Schema.md#Schema+extend) Schema. Retains the errorLevel from the calling Model.


| Param | Type |
| --- | --- |
| model | [<code>Model</code>](#Model), <code>Schema</code>, <code>SchemaDefinition</code> | 


<br><a name="Model+errorLevel"></a>

#### model.errorLevel(errorLevel) ⇒ [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> How to handle errors on this model. Overrides Model.defaultErrorLevel()

**Default**: <code>MODEL_ERROR_LEVEL.UNSET</code>  

| Param | Type |
| --- | --- |
| errorLevel | [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL) | 


<br><a name="Model+onChange"></a>

#### model.onChange(callback) ⇒ <code>Queue</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Called when a change is observed on an object applied to this model

**See**: [Queue](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/Queue.md)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Provides three args: path, value, and previous value. Context is the model that changed. |


<br><a name="Model+onError"></a>

#### model.onError(callback) ⇒ <code>Queue</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Called when an error is returned from Schema validation

**See**: [Queue](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/Queue.md)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Provides one arg: an array of errors. Context is the model that changed. |


<br><a name="Model.defaultErrorLevel"></a>

#### Model.defaultErrorLevel(errorLevel) ⇒ [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL)
> How to handle errors on all models

**Default**: <code>MODEL_ERROR_LEVEL.WARN</code>  

| Param | Type |
| --- | --- |
| errorLevel | [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL) | 


<br><a name="MODEL_ERROR_LEVEL"></a>

### MODEL\_ERROR\_LEVEL : <code>Enum</code>
> How to handle Schema validation errors in models.

**Properties**

| Name | Description |
| --- | --- |
| UNSET | Errors are ignored. |
| WARN | Console.warn |
| ERROR | Console.error |
| THROW | Throw an exception |


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
