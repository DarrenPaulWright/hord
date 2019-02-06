# hord
[![npm][npm]][npm-url]
[![build][build]][build-url]
[![Coverage Status](https://coveralls.io/repos/github/DarrenPaulWright/hord/badge.svg?branch=master)](https://coveralls.io/github/DarrenPaulWright/hord?branch=master)
[![deps][deps]][deps-url]
[![size][size]][size-url]
[![Known Vulnerabilities](https://snyk.io/test/github/DarrenPaulWright/hord/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DarrenPaulWright/hord?targetFile=package.json)

A data storage and manipulation library for javascript

<a name="List"></a>

## List
**Kind**: global class  

* [List](#List)
    * [new List([values])](#new_List_new)
    * _instance_
        * [.length](#List+length) ⇒ <code>Number</code>
        * [.sort()](#List+sort)
        * [.add(item)](#List+add) ⇒ <code>this</code>
        * [.concat(values)](#List+concat) ⇒ <code>this</code>
        * [.discard(item)](#List+discard) ⇒ <code>this</code>
        * [.values([values])](#List+values) ⇒ <code>this</code> \| <code>Array</code>
        * [.indexOf(item)](#List+indexOf) ⇒ <code>Number</code>
        * [.lastIndexOf(item)](#List+lastIndexOf) ⇒ <code>Number</code>
        * [.includes(item)](#List+includes) ⇒ <code>Boolean</code>
        * [.find(item)](#List+find) ⇒ <code>\*</code>
        * [.findLast(item)](#List+findLast) ⇒ <code>\*</code>
        * [.findAll(item)](#List+findAll) ⇒ <code>Array</code>
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
        * [.filter(callback, [thisArg])](#List+filter) ⇒ <code>Array</code>
        * [.forEach(callback, [thisArg])](#List+forEach) ⇒ <code>undefined</code>
        * [.toLocaleString([locales], [options])](#List+toLocaleString) ⇒ <code>String</code>
        * [.join([separator])](#List+join) ⇒ <code>String</code>
        * [.map(callback, [thisArg])](#List+map) ⇒ <code>Array</code>
        * [.reduce(callback, [thisArg])](#List+reduce) ⇒ <code>\*</code>
        * [.reduceRight(callback, [thisArg])](#List+reduceRight) ⇒ <code>\*</code>
        * [.slice([begin], [end])](#List+slice) ⇒ <code>Array</code>
        * [.some(callback, [thisArg])](#List+some) ⇒ <code>Boolean</code>
    * _static_
        * [.sorter](#List.sorter)

<a name="new_List_new"></a>

### new List([values])
Always sorted array.


| Param | Type |
| --- | --- |
| [values] | <code>Array</code> | 

<a name="List+length"></a>

### list.length ⇒ <code>Number</code>
The number of items in the list

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+sort"></a>

### list.sort()
Sort the items.

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List+add"></a>

### list.add(item) ⇒ <code>this</code>
Add an item to the list. Uses binary search.

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Item is inserted into the list such that the items are still sorted. |

<a name="List+concat"></a>

### list.concat(values) ⇒ <code>this</code>
Merges one or more arrays with the list.

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| values | <code>\*</code> | 

<a name="List+discard"></a>

### list.discard(item) ⇒ <code>this</code>
Discard an item from the list. Uses binary search.

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+values"></a>

### list.values([values]) ⇒ <code>this</code> \| <code>Array</code>
The current items in the list.

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Description |
| --- | --- | --- |
| [values] | <code>Array</code> | If provided, replaces any previous values with these, otherwise return the current values. |

<a name="List+indexOf"></a>

### list.indexOf(item) ⇒ <code>Number</code>
Gets the index of the first matching item. Uses a binary search.

**Kind**: instance method of [<code>List</code>](#List)  
**Returns**: <code>Number</code> - - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+lastIndexOf"></a>

### list.lastIndexOf(item) ⇒ <code>Number</code>
Gets the index of the last matching item. Uses a binary search.

**Kind**: instance method of [<code>List</code>](#List)  
**Returns**: <code>Number</code> - - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+includes"></a>

### list.includes(item) ⇒ <code>Boolean</code>
Determines if an item exists in the list. Uses a binary search.

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+find"></a>

### list.find(item) ⇒ <code>\*</code>
Gets the first matching item from the list. Uses a binary search.

**Kind**: instance method of [<code>List</code>](#List)  
**Returns**: <code>\*</code> - - The item or undefined  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+findLast"></a>

### list.findLast(item) ⇒ <code>\*</code>
Gets the last matching item from the list. Uses a binary search.

**Kind**: instance method of [<code>List</code>](#List)  
**Returns**: <code>\*</code> - - The item or undefined  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+findAll"></a>

### list.findAll(item) ⇒ <code>Array</code>
Gets all the matching items from the list. Uses a binary search.

**Kind**: instance method of [<code>List</code>](#List)  
**Returns**: <code>Array</code> - - An array of items or undefined  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+findIndex"></a>

### list.findIndex(item) ⇒ <code>Number</code>
Gets the index of the first matching item. Uses a binary search. (Identical to indexOf)

**Kind**: instance method of [<code>List</code>](#List)  
**Returns**: <code>Number</code> - - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+findLastIndex"></a>

### list.findLastIndex(item) ⇒ <code>Number</code>
Gets the index of the last matching item. Uses a binary search. (Identical to lastIndexOf)

**Kind**: instance method of [<code>List</code>](#List)  
**Returns**: <code>Number</code> - - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Uses the sorter function to determine equality. |

<a name="List+first"></a>

### list.first() ⇒ <code>\*</code>
Gets the first item in the list without removing it.

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List+last"></a>

### list.last() ⇒ <code>\*</code>
Gets the last item in the list without removing it.

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List+sorter"></a>

### list.sorter(sorter) ⇒ <code>\*</code>
The sorting function. This function is used by .sort() and the binary search to determine equality.

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| sorter | <code>function</code> | 

<a name="List+pop"></a>

### list.pop() ⇒ <code>\*</code>
See [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List+shift"></a>

### list.shift() ⇒ <code>\*</code>
See [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List+toString"></a>

### list.toString() ⇒ <code>String</code>
See [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List+keys"></a>

### list.keys() ⇒ <code>Object</code>
See [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List+every"></a>

### list.every(callback, [thisArg]) ⇒ <code>Boolean</code>
See [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="List+filter"></a>

### list.filter(callback, [thisArg]) ⇒ <code>Array</code>
See [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="List+forEach"></a>

### list.forEach(callback, [thisArg]) ⇒ <code>undefined</code>
See [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="List+toLocaleString"></a>

### list.toLocaleString([locales], [options]) ⇒ <code>String</code>
See [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| [locales] | <code>Array</code> | 
| [options] | <code>Object</code> | 

<a name="List+join"></a>

### list.join([separator]) ⇒ <code>String</code>
See [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Default |
| --- | --- | --- |
| [separator] | <code>String</code> | <code>&#x27;,&#x27;</code> | 

<a name="List+map"></a>

### list.map(callback, [thisArg]) ⇒ <code>Array</code>
See [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="List+reduce"></a>

### list.reduce(callback, [thisArg]) ⇒ <code>\*</code>
See [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="List+reduceRight"></a>

### list.reduceRight(callback, [thisArg]) ⇒ <code>\*</code>
See [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="List+slice"></a>

### list.slice([begin], [end]) ⇒ <code>Array</code>
See [Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Default |
| --- | --- | --- |
| [begin] | <code>Number</code> | <code>0</code> | 
| [end] | <code>Number</code> | <code>array.length</code> | 

<a name="List+some"></a>

### list.some(callback, [thisArg]) ⇒ <code>Boolean</code>
See [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="List.sorter"></a>

### List.sorter
Some simple sorter functions.

**Kind**: static property of [<code>List</code>](#List)  
**Read only**: true  
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