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
        * [.errorLevel(errorLevel)](#Model+errorLevel) ⇒ [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL)
        * [.onChange(callback)](#Model+onChange) ⇒ <code>function</code>
        * [.onError(callback)](#Model+onError) ⇒ <code>function</code>
    * _static_
        * [.defaultErrorLevel(errorLevel)](#Model.defaultErrorLevel) ⇒ [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL)


<br><a name="new_Model_new"></a>

#### new Model(schema)
> Models with automatic schema enforcement. Once the Model is instantiated the schema can't be changed.


| Param | Type |
| --- | --- |
| schema | <code>Schema</code> | 

**Example**  
``` javascript

<br><a name="Model+schema"></a>

#### model.schema ⇒ <code>Schema</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔒 Read only`_

> Get the schema for this model


<br><a name="Model+apply"></a>

#### model.apply(object) ⇒ <code>Object</code>
> Apply this model to an object


| Param | Type |
| --- | --- |
| object | <code>Object</code> | 


<br><a name="Model+errorLevel"></a>

#### model.errorLevel(errorLevel) ⇒ [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> How to handle errors on this model. Overrides Model.defaultErrorLevel()

**Default**: <code>MODEL_ERROR_LEVEL.SILENT</code>  

| Param | Type |
| --- | --- |
| errorLevel | [<code>MODEL\_ERROR\_LEVEL</code>](#MODEL_ERROR_LEVEL) | 


<br><a name="Model+onChange"></a>

#### model.onChange(callback) ⇒ <code>function</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Called when a change is observed on an object applied to this model


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 


<br><a name="Model+onError"></a>

#### model.onError(callback) ⇒ <code>function</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Called when an error is returned from Schema validation


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 


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
| SILENT | Errors are silenced |
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