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


<br><a name="List"></a>

### List
``` javascriptimport { List } from 'hord';```

* [List](#List)
    * [new List([values])](#new_List_new)
    * _instance_
        * [.length](#List+length) ⇒ <code>Number</code>
        * [.sort()](#List+sort) ↩︎
        * [.add(item)](#List+add) ↩︎
        * [.addUnique(item)](#List+addUnique) ↩︎
        * [.unique()](#List+unique) ⇒ [<code>List</code>](#List)
        * [.concat(values)](#List+concat) ↩︎
        * [.discard(item)](#List+discard) ↩︎
        * [.discardAll()](#List+discardAll) ↩︎
        * [.values([values])](#List+values) ⇒ <code>Array</code>
        * [.indexOf(item)](#List+indexOf) ⇒ <code>Number</code>
        * [.lastIndexOf(item)](#List+lastIndexOf) ⇒ <code>Number</code>
        * [.includes(item)](#List+includes) ⇒ <code>Boolean</code>
        * [.find(item)](#List+find) ⇒ <code>\*</code>
        * [.findLast(item)](#List+findLast) ⇒ <code>\*</code>
        * [.findAll(item)](#List+findAll) ⇒ [<code>List</code>](#List)
        * [.findIndex(item)](#List+findIndex) ⇒ <code>Number</code>
        * [.findLastIndex(item)](#List+findLastIndex) ⇒ <code>Number</code>
        * [.first()](#List+first) ⇒ <code>\*</code>
        * [.last()](#List+last) ⇒ <code>\*</code>
        * [.sorter(sorter)](#List+sorter) ⇒ <code>\*</code>
        * [.pop()](#List+pop) ⇒ <code>\*</code>
        * [.shift()](#List+shift) ⇒ <code>\*</code>
        * [.toString()](#List+toString) ⇒ <code>String</code>
        * [.keys()](#List+keys) ⇒ <code>Object</code>
        * [.every(callback, [thisArg])](#List+every) ⇒ <code>Boolean</code>
        * [.forEach(callback, [thisArg])](#List+forEach) ⇒ <code>undefined</code>
        * [.toLocaleString([locales], [options])](#List+toLocaleString) ⇒ <code>String</code>
        * [.join([separator])](#List+join) ⇒ <code>String</code>
        * [.map(callback, [thisArg])](#List+map) ⇒ <code>Array</code>
        * [.reduce(callback, [thisArg])](#List+reduce) ⇒ <code>\*</code>
        * [.reduceRight(callback, [thisArg])](#List+reduceRight) ⇒ <code>\*</code>
        * [.some(callback, [thisArg])](#List+some) ⇒ <code>Boolean</code>
        * [.filter(callback, [thisArg])](#List+filter) ⇒ [<code>List</code>](#List)
        * [.slice([begin], [end])](#List+slice) ⇒ [<code>List</code>](#List)
    * _static_
        * [.sorter](#List.sorter)


<br><a name="new_List_new"></a>

#### new List([values])
> Always sorted array.> > List maintains a sorted state internally, but doesn't observe changes to it's contents, so items manipulated externally can cause problems. If you must do this, the .sort() method is provided to resort the list.


| Param | Type |
| --- | --- |
| [values] | <code>Array</code> | 


<br><a name="List+length"></a>

#### list.length ⇒ <code>Number</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔒 Read only`_

> The number of items in the list


<br><a name="List+sort"></a>

#### list.sort() ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Sort the items.


<br><a name="List+add"></a>

#### list.add(item) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Add an item to the list. Uses binary search.


| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Item is inserted into the list such that the items are still sorted. |


<br><a name="List+addUnique"></a>

#### list.addUnique(item) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Add an item to the list if it isn't already included. Uses binary search.


| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Item is inserted into the list such that the items are still sorted. |


<br><a name="List+unique"></a>

#### list.unique() ⇒ [<code>List</code>](#List)
> Get a new List of the unique (as determined by the sorter) values in this List.


<br><a name="List+concat"></a>

#### list.concat(values) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Merges one or more arrays with the list.


| Param | Type |
| --- | --- |
| values | <code>\*</code> | 


<br><a name="List+discard"></a>

#### list.discard(item) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Discard an item from the list. Uses binary search.


| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+discardAll"></a>

#### list.discardAll() ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Discard all items from the list.


<br><a name="List+values"></a>

#### list.values([values]) ⇒ <code>Array</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> The current items in the list.

**Returns**: <code>Array</code> - A shallow clone of the values  

| Param | Type | Description |
| --- | --- | --- |
| [values] | <code>Array</code> | Replaces any previous values and immediately sorts them. |


<br><a name="List+indexOf"></a>

#### list.indexOf(item) ⇒ <code>Number</code>
> Gets the index of the first matching item. Uses a binary search.

**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+lastIndexOf"></a>

#### list.lastIndexOf(item) ⇒ <code>Number</code>
> Gets the index of the last matching item. Uses a binary search.

**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+includes"></a>

#### list.includes(item) ⇒ <code>Boolean</code>
> Determines if an item exists in the list. Uses a binary search.


| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+find"></a>

#### list.find(item) ⇒ <code>\*</code>
> Gets the first matching item from the list. Uses a binary search.

**Returns**: <code>\*</code> - The item or undefined  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+findLast"></a>

#### list.findLast(item) ⇒ <code>\*</code>
> Gets the last matching item from the list. Uses a binary search.

**Returns**: <code>\*</code> - The item or undefined  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+findAll"></a>

#### list.findAll(item) ⇒ [<code>List</code>](#List)
> Gets all the matching items from the list. Uses a binary search.

**Returns**: [<code>List</code>](#List) - A list of items  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+findIndex"></a>

#### list.findIndex(item) ⇒ <code>Number</code>
> Gets the index of the first matching item. Uses a binary search. (Identical to indexOf)

**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+findLastIndex"></a>

#### list.findLastIndex(item) ⇒ <code>Number</code>
> Gets the index of the last matching item. Uses a binary search. (Identical to lastIndexOf)

**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |


<br><a name="List+first"></a>

#### list.first() ⇒ <code>\*</code>
> Gets the first item in the list without removing it.


<br><a name="List+last"></a>

#### list.last() ⇒ <code>\*</code>
> Gets the last item in the list without removing it.


<br><a name="List+sorter"></a>

#### list.sorter(sorter) ⇒ <code>\*</code>
> The sorting function. This function is used by .sort() and the binary search to determine equality.> > See the compareFunction for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters) for details.> A few simple sorter functions are provided via the static property [List.sorter](#List.sorter)> > If you're setting this, you may want to call this before setting the values, like this:> ``` javascript> import { List } from 'hord';> > const list = new List().sorter(List.sorter.number.asc).values([1,2,3]);> ```


| Param | Type |
| --- | --- |
| sorter | <code>function</code> | 


<br><a name="List+pop"></a>

#### list.pop() ⇒ <code>\*</code>
> See [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)


<br><a name="List+shift"></a>

#### list.shift() ⇒ <code>\*</code>
> See [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)


<br><a name="List+toString"></a>

#### list.toString() ⇒ <code>String</code>
> See [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)


<br><a name="List+keys"></a>

#### list.keys() ⇒ <code>Object</code>
> See [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)


<br><a name="List+every"></a>

#### list.every(callback, [thisArg]) ⇒ <code>Boolean</code>
> See [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="List+forEach"></a>

#### list.forEach(callback, [thisArg]) ⇒ <code>undefined</code>
> See [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="List+toLocaleString"></a>

#### list.toLocaleString([locales], [options]) ⇒ <code>String</code>
> See [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)


| Param | Type |
| --- | --- |
| [locales] | <code>Array</code> | 
| [options] | <code>Object</code> | 


<br><a name="List+join"></a>

#### list.join([separator]) ⇒ <code>String</code>
> See [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)


| Param | Type | Default |
| --- | --- | --- |
| [separator] | <code>String</code> | <code>&#x27;,&#x27;</code> | 


<br><a name="List+map"></a>

#### list.map(callback, [thisArg]) ⇒ <code>Array</code>
> See [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="List+reduce"></a>

#### list.reduce(callback, [thisArg]) ⇒ <code>\*</code>
> See [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="List+reduceRight"></a>

#### list.reduceRight(callback, [thisArg]) ⇒ <code>\*</code>
> See [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="List+some"></a>

#### list.some(callback, [thisArg]) ⇒ <code>Boolean</code>
> See [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="List+filter"></a>

#### list.filter(callback, [thisArg]) ⇒ [<code>List</code>](#List)
> See [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="List+slice"></a>

#### list.slice([begin], [end]) ⇒ [<code>List</code>](#List)
> See [Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)


| Param | Type | Default |
| --- | --- | --- |
| [begin] | <code>Number</code> | <code>0</code> | 
| [end] | <code>Number</code> | <code>array.length</code> | 


<br><a name="List.sorter"></a>

#### List.sorter&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔒 Read only`_

> Some simple sorter functions.

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| default | <code>function</code> | Replicates the default behavior of Array.sort() |
| string | <code>Object</code> |  |
| string.asc | <code>function</code> | Uses localeCompare to sort strings. This is less efficient, but is useful for lists that will be displayed to users. |
| string.desc | <code>function</code> | Inverse of string.asc |
| number | <code>Object</code> |  |
| number.asc | <code>function</code> | Sorts numbers in numeric order |
| number.desc | <code>function</code> | Inverse of number.asc |


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
