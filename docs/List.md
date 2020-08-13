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

## List
> Always sorted array.


* [List](#List)
    * [new List(values)](#new_List_new)
    * _instance_
        * [.total](#List+total) ⇒ <code>number</code>
        * [.length](#List+length) ⇒ <code>number.int</code>
        * [.comparer(comparer)](#List+comparer) ⇒ <code>function</code>
        * [.sort()](#List+sort) ⇒ <code>object</code>
        * [.add(item)](#List+add) ⇒ <code>object</code>
        * [.addUnique(item)](#List+addUnique) ⇒ <code>object</code>
        * [.unique()](#List+unique) ⇒ [<code>List</code>](#List)
        * [.concat(...lists)](#List+concat) ⇒ [<code>List</code>](#List)
        * [.discard(item)](#List+discard) ⇒ <code>object</code>
        * [.discardAt(index)](#List+discardAt) ⇒ <code>object</code>
        * [.discardAll()](#List+discardAll) ⇒ <code>object</code>
        * [.values([values])](#List+values) ⇒ <code>Array</code>
        * [.indexOf(item)](#List+indexOf) ⇒ <code>number.int</code>
        * [.lastIndexOf(item)](#List+lastIndexOf) ⇒ <code>number.int</code>
        * [.includes(item)](#List+includes) ⇒ <code>boolean</code>
        * [.find(item)](#List+find) ⇒ <code>\*</code>
        * [.findLast(item)](#List+findLast) ⇒ <code>\*</code>
        * [.findAll(item)](#List+findAll) ⇒ [<code>List</code>](#List)
        * [.findIndex(item)](#List+findIndex) ⇒ <code>number.int</code>
        * [.findLastIndex(item)](#List+findLastIndex) ⇒ <code>number.int</code>
        * [.first()](#List+first) ⇒ <code>\*</code>
        * [.last()](#List+last) ⇒ <code>\*</code>
        * [.someRight(callback, [thisArg])](#List+someRight) ⇒ [<code>List</code>](#List)
        * [.intersection(array)](#List+intersection) ⇒ [<code>List</code>](#List)
        * [.median([low], [high])](#List+median) ⇒ <code>number</code>
        * [.mean()](#List+mean) ⇒ <code>number</code>
        * [.quartiles()](#List+quartiles) ⇒ <code>object</code>
        * [.pop()](#List+pop) ⇒ <code>\*</code>
        * [.shift()](#List+shift) ⇒ <code>\*</code>
        * [.toString()](#List+toString) ⇒ <code>string</code>
        * [.keys()](#List+keys) ⇒ <code>object</code>
        * [.every(callback, [thisArg])](#List+every) ⇒ <code>boolean</code>
        * [.forEach(callback, [thisArg])](#List+forEach) ⇒ <code>undefined</code>
        * [.toLocaleString([locales], [options])](#List+toLocaleString) ⇒ <code>string</code>
        * [.join([separator])](#List+join) ⇒ <code>string</code>
        * [.map(callback, [thisArg])](#List+map) ⇒ <code>Array</code>
        * [.reduce(callback, [thisArg])](#List+reduce) ⇒ <code>\*</code>
        * [.reduceRight(callback, [thisArg])](#List+reduceRight) ⇒ <code>\*</code>
        * [.some(callback, [thisArg])](#List+some) ⇒ <code>boolean</code>
        * [.filter(callback, [thisArg])](#List+filter) ⇒ [<code>List</code>](#List)
        * [.slice([begin], [end])](#List+slice) ⇒ [<code>List</code>](#List)
    * _static_
        * [.comparers](#List.comparers)


<br><a name="new_List_new"></a>

### new List(values)
> ``` javascript
> import { List } from 'hord';
> ```
> List maintains a sorted state internally, but doesn't observe changes to it's contents, so items manipulated externally can cause problems. If you must do this, the .sort() method is provided to resort the list.


| Param | Type | Description |
| --- | --- | --- |
| values | <code>\*</code>, <code>Array</code> | Accepts an array of objects or multiple args of objects. |


<br><a name="List+total"></a>

### list.total ⇒ <code>number</code>
> If the values in the list are Numbers, then this will return the total value of all the elements added together.


<br><a name="List+length"></a>

### list.length ⇒ <code>number.int</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔒 Read only`_

> The number of items in the list.


<br><a name="List+comparer"></a>

### list.comparer(comparer) ⇒ <code>function</code>
> Used by .sort() and the binary search to determine equality.
> 
> If you're setting this, you may want to call this before setting the values to prevent sorting twice, like this:
> ``` javascript
> import { List } from 'hord';
> 
> const list = new List().comparer(List.comparers.number.asc).values([1, 2, 3]);
> ```


| Param | Type | Description |
| --- | --- | --- |
| comparer | <code>function</code> | See the compare function for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters) for details. A few simple comparer functions are provided via the static property [List.comparers](#List.comparers). |


<br><a name="List+sort"></a>

### list.sort() ⇒ <code>object</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Sort the items.

**Returns**: <code>object</code> - Returns `this`.  

<br><a name="List+add"></a>

### list.add(item) ⇒ <code>object</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Add an item to the list. Uses binary search.

**Returns**: <code>object</code> - Returns `this`.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Item is inserted into the list such that the items are still sorted. |


<br><a name="List+addUnique"></a>

### list.addUnique(item) ⇒ <code>object</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Add an item to the list if it isn't already included. Uses binary search.

**Returns**: <code>object</code> - Returns `this`.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Item is inserted into the list such that the items are still sorted. |


<br><a name="List+unique"></a>

### list.unique() ⇒ [<code>List</code>](#List)
> Get a new List of the unique (as determined by the comparer) values in this List.


<br><a name="List+concat"></a>

### list.concat(...lists) ⇒ [<code>List</code>](#List)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Returns a shallow clone of this list with the contents of one or more arrays or lists appended.


| Param | Type | Description |
| --- | --- | --- |
| ...lists | <code>Array</code>, [<code>List</code>](#List) | One or more lists or arrays to concat to this list. |


<br><a name="List+discard"></a>

### list.discard(item) ⇒ <code>object</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Discard an item from the list. Uses binary search.

**Returns**: <code>object</code> - Returns `this`.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+discardAt"></a>

### list.discardAt(index) ⇒ <code>object</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Discard an item from the list at a specified index.

**Returns**: <code>object</code> - Returns `this`.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>\*</code> | The index of the item to be discarded. |


<br><a name="List+discardAll"></a>

### list.discardAll() ⇒ <code>object</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Discard all items from the list.

**Returns**: <code>object</code> - Returns `this`.  

<br><a name="List+values"></a>

### list.values([values]) ⇒ <code>Array</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> The current items in the list.

**Returns**: <code>Array</code> - A shallow clone of the values.  

| Param | Type | Description |
| --- | --- | --- |
| [values] | <code>Array</code> | Replaces any previous values and immediately sorts them. |


<br><a name="List+indexOf"></a>

### list.indexOf(item) ⇒ <code>number.int</code>
> Gets the index of the first matching item. Uses a binary search.

**Returns**: <code>number.int</code> - The index of the item or -1.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+lastIndexOf"></a>

### list.lastIndexOf(item) ⇒ <code>number.int</code>
> Gets the index of the last matching item. Uses a binary search.

**Returns**: <code>number.int</code> - The index of the item or -1.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+includes"></a>

### list.includes(item) ⇒ <code>boolean</code>
> Determines if an item exists in the list. Uses a binary search.


| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+find"></a>

### list.find(item) ⇒ <code>\*</code>
> Gets the first matching item from the list. Uses a binary search.

**Returns**: <code>\*</code> - The item or undefined.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+findLast"></a>

### list.findLast(item) ⇒ <code>\*</code>
> Gets the last matching item from the list. Uses a binary search.

**Returns**: <code>\*</code> - The item or undefined.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+findAll"></a>

### list.findAll(item) ⇒ [<code>List</code>](#List)
> Gets all the matching items from the list. Uses a binary search.


| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+findIndex"></a>

### list.findIndex(item) ⇒ <code>number.int</code>
> Gets the index of the first matching item. Uses a binary search (Identical to indexOf).

**Returns**: <code>number.int</code> - The index of the item or -1.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+findLastIndex"></a>

### list.findLastIndex(item) ⇒ <code>number.int</code>
> Gets the index of the last matching item. Uses a binary search (Identical to lastIndexOf).

**Returns**: <code>number.int</code> - The index of the item or -1.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the comparer function to determine equality. |


<br><a name="List+first"></a>

### list.first() ⇒ <code>\*</code>
> Gets the first item in the list without removing it.


<br><a name="List+last"></a>

### list.last() ⇒ <code>\*</code>
> Gets the last item in the list without removing it.


<br><a name="List+someRight"></a>

### list.someRight(callback, [thisArg]) ⇒ [<code>List</code>](#List)
> Like .some(), but starts on the last (greatest index) item and progresses backwards.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | Provides two arguments, the element and the index of the element. |
| [thisArg] | <code>object</code> | <code>this</code> | A value to use as `this` when executing `callback`. |


<br><a name="List+intersection"></a>

### list.intersection(array) ⇒ [<code>List</code>](#List)
> Gets the items that exist both in this list and in another list or array. Equality of items is determined by the comparer.


| Param | Type | Description |
| --- | --- | --- |
| array | [<code>List</code>](#List), <code>Array</code> | Another list or array. |


<br><a name="List+median"></a>

### list.median([low], [high]) ⇒ <code>number</code>
> If the values in the list are Numbers, then this will return the median value. If there are an odd number of elements, then the value of the middle element is returned. If there are an even number of elements then the mean of the middle two elements is returned. To get the mean of a range of elements, low and high can be provided.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [low] | <code>number.int</code> | <code>0</code> | Index of a range to start at. |
| [high] | <code>number.int</code> | <code>n</code> | Index of a range to end at. |


<br><a name="List+mean"></a>

### list.mean() ⇒ <code>number</code>
> If the values in the list are Numbers, then this will return the mean(average) of all the elements.


<br><a name="List+quartiles"></a>

### list.quartiles() ⇒ <code>object</code>
> If the values in the list are Numbers, then this will return an object with a [quartile](https://en.wikipedia.org/wiki/Quartile) summary.

**Returns**: <code>object</code> - Contains min, Q1, median, Q3, max, and outliers. All are numbers except outliers, which is an array of all outliers (low and high).  

<br><a name="List+pop"></a>

### list.pop() ⇒ <code>\*</code>
> See [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)


<br><a name="List+shift"></a>

### list.shift() ⇒ <code>\*</code>
> See [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)


<br><a name="List+toString"></a>

### list.toString() ⇒ <code>string</code>
> See [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)


<br><a name="List+keys"></a>

### list.keys() ⇒ <code>object</code>
> See [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)


<br><a name="List+every"></a>

### list.every(callback, [thisArg]) ⇒ <code>boolean</code>
> See [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | Provides two arguments, the element and the index of the element. |
| [thisArg] | <code>object</code> | <code>this</code> | A value to use as `this` when executing `callback`. |


<br><a name="List+forEach"></a>

### list.forEach(callback, [thisArg]) ⇒ <code>undefined</code>
> See [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | Provides two arguments, the element and the index of the element. |
| [thisArg] | <code>object</code> | <code>this</code> | A value to use as `this` when executing `callback`. |


<br><a name="List+toLocaleString"></a>

### list.toLocaleString([locales], [options]) ⇒ <code>string</code>
> See [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)


| Param | Type |
| --- | --- |
| [locales] | <code>Array</code> | 
| [options] | <code>object</code> | 


<br><a name="List+join"></a>

### list.join([separator]) ⇒ <code>string</code>
> See [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)


| Param | Type | Default |
| --- | --- | --- |
| [separator] | <code>string</code> | <code>&quot;&#x27;,&#x27;&quot;</code> | 


<br><a name="List+map"></a>

### list.map(callback, [thisArg]) ⇒ <code>Array</code>
> See [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | Provides two arguments, the element and the index of the element. |
| [thisArg] | <code>object</code> | <code>this</code> | A value to use as `this` when executing `callback`. |


<br><a name="List+reduce"></a>

### list.reduce(callback, [thisArg]) ⇒ <code>\*</code>
> See [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  |  |
| [thisArg] | <code>object</code> | <code>this</code> | A value to use as `this` when executing `callback`. |


<br><a name="List+reduceRight"></a>

### list.reduceRight(callback, [thisArg]) ⇒ <code>\*</code>
> See [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  |  |
| [thisArg] | <code>object</code> | <code>this</code> | A value to use as `this` when executing `callback`. |


<br><a name="List+some"></a>

### list.some(callback, [thisArg]) ⇒ <code>boolean</code>
> See [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | Provides two arguments, the element and the index of the element. |
| [thisArg] | <code>object</code> | <code>this</code> | A value to use as `this` when executing `callback`. |


<br><a name="List+filter"></a>

### list.filter(callback, [thisArg]) ⇒ [<code>List</code>](#List)
> See [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | Provides two arguments, the element and the index of the element. |
| [thisArg] | <code>object</code> | <code>this</code> | A value to use as `this` when executing `callback`. |


<br><a name="List+slice"></a>

### list.slice([begin], [end]) ⇒ [<code>List</code>](#List)
> See [Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)


| Param | Type | Default |
| --- | --- | --- |
| [begin] | <code>number.int</code> | <code>0</code> | 
| [end] | <code>number.int</code> | <code>array.length</code> | 


<br><a name="List.comparers"></a>

### List.comparers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔒 Read only`_

> Some simple comparer functions.

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| default | <code>function</code> | Replicates the default behavior of Array.sort(). |
| string | <code>object</code> |  |
| string.asc | <code>function</code> | Uses localeCompare to sort strings. This is less efficient, but is useful for lists that will be displayed to users. |
| string.desc | <code>function</code> | Inverse of string.asc |
| number | <code>object</code> |  |
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
