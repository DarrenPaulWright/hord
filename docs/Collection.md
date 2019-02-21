# hord
[![npm][npm]][npm-url]
[![build][build]][build-url]
[![Coverage Status](https://coveralls.io/repos/github/DarrenPaulWright/hord/badge.svg?branch=master)](https://coveralls.io/github/DarrenPaulWright/hord?branch=master)
[![deps][deps]][deps-url]
[![size][size]][size-url]
[![Known Vulnerabilities](https://snyk.io/test/github/DarrenPaulWright/hord/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DarrenPaulWright/hord?targetFile=package.json)

A data storage and manipulation library for javascript

<a name="Collection"></a>

## Collection ⇐ <code>Array</code>
**Kind**: global class  
**Extends**: <code>Array</code>  

* [Collection](#Collection) ⇐ <code>Array</code>
    * [new Collection()](#new_Collection_new)
    * [.pop()](#Collection+pop) ⇒ <code>\*</code>
    * [.shift()](#Collection+shift) ⇒ <code>\*</code>
    * [.toString()](#Collection+toString) ⇒ <code>String</code>
    * [.keys()](#Collection+keys) ⇒ <code>Object</code>
    * [.every(callback, [thisArg])](#Collection+every) ⇒ <code>Boolean</code>
    * [.forEach(callback, [thisArg])](#Collection+forEach) ⇒ <code>undefined</code>
    * [.toLocaleString([locales], [options])](#Collection+toLocaleString) ⇒ <code>String</code>
    * [.join([separator])](#Collection+join) ⇒ <code>String</code>
    * [.reduce(callback, [thisArg])](#Collection+reduce) ⇒ <code>\*</code>
    * [.reduceRight(callback, [thisArg])](#Collection+reduceRight) ⇒ <code>\*</code>
    * [.some(callback, [thisArg])](#Collection+some) ⇒ <code>Boolean</code>
    * [.first()](#Collection+first) ⇒ <code>Object</code>
    * [.last()](#Collection+last) ⇒ <code>Object</code>
    * [.indexOf(item)](#Collection+indexOf) ⇒ <code>Number</code>
    * [.lastIndexOf(item)](#Collection+lastIndexOf) ⇒ <code>Number</code>
    * [.includes(item)](#Collection+includes) ⇒ <code>Boolean</code>
    * [.forEachRight(callback)](#Collection+forEachRight)
    * [.someRight(callback)](#Collection+someRight) ⇒ <code>Boolean</code>
    * [.find(matcher)](#Collection+find) ⇒ <code>Object</code>
    * [.findLast(matcher)](#Collection+findLast) ⇒ <code>Object</code>
    * [.map(callback)](#Collection+map) ⇒ [<code>Collection</code>](#Collection)
    * [.filter(matcher)](#Collection+filter) ⇒ [<code>Collection</code>](#Collection)
    * [.findIndex(matcher)](#Collection+findIndex) ⇒ <code>Number</code>
    * [.findLastIndex(matcher)](#Collection+findLastIndex) ⇒ <code>Number</code>
    * [.slice(begin, [end])](#Collection+slice) ⇒ [<code>Collection</code>](#Collection)
    * [.sliceBy(beginMatcher, [endMatcher])](#Collection+sliceBy) ⇒ [<code>Collection</code>](#Collection)
    * [.flatten([settings])](#Collection+flatten) ⇒ [<code>Collection</code>](#Collection)
    * [.nest([settings])](#Collection+nest) ⇒ [<code>Collection</code>](#Collection)
    * [.eachChild(onChild, [settings])](#Collection+eachChild)
    * [.unique([countKey])](#Collection+unique) ⇒ [<code>Collection</code>](#Collection)
    * [.merge(collections, idKey, callback)](#Collection+merge) ⇒ [<code>Collection</code>](#Collection)

<a name="new_Collection_new"></a>

### new Collection()
Indexed Collections for high performance searching.## Usage``` javascriptimport { Collection } from 'hord';```


| Type | Description |
| --- | --- |
| <code>Array</code> \| <code>Object</code> | Accepts an array of objects or multiple args of objects. |

<a name="Collection+pop"></a>

### collection.pop() ⇒ <code>\*</code>
See [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

**Kind**: instance method of [<code>Collection</code>](#Collection)  
<a name="Collection+shift"></a>

### collection.shift() ⇒ <code>\*</code>
See [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

**Kind**: instance method of [<code>Collection</code>](#Collection)  
<a name="Collection+toString"></a>

### collection.toString() ⇒ <code>String</code>
See [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)

**Kind**: instance method of [<code>Collection</code>](#Collection)  
<a name="Collection+keys"></a>

### collection.keys() ⇒ <code>Object</code>
See [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)

**Kind**: instance method of [<code>Collection</code>](#Collection)  
<a name="Collection+every"></a>

### collection.every(callback, [thisArg]) ⇒ <code>Boolean</code>
See [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="Collection+forEach"></a>

### collection.forEach(callback, [thisArg]) ⇒ <code>undefined</code>
See [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="Collection+toLocaleString"></a>

### collection.toLocaleString([locales], [options]) ⇒ <code>String</code>
See [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| [locales] | <code>Array</code> | 
| [options] | <code>Object</code> | 

<a name="Collection+join"></a>

### collection.join([separator]) ⇒ <code>String</code>
See [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Default |
| --- | --- | --- |
| [separator] | <code>String</code> | <code>&#x27;,&#x27;</code> | 

<a name="Collection+reduce"></a>

### collection.reduce(callback, [thisArg]) ⇒ <code>\*</code>
See [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="Collection+reduceRight"></a>

### collection.reduceRight(callback, [thisArg]) ⇒ <code>\*</code>
See [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="Collection+some"></a>

### collection.some(callback, [thisArg]) ⇒ <code>Boolean</code>
See [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 

<a name="Collection+first"></a>

### collection.first() ⇒ <code>Object</code>
Gets the first item in the collection without removing it.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
<a name="Collection+last"></a>

### collection.last() ⇒ <code>Object</code>
Gets the last item in the collection without removing it.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
<a name="Collection+indexOf"></a>

### collection.indexOf(item) ⇒ <code>Number</code>
Gets the index of the first matching item.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 

<a name="Collection+lastIndexOf"></a>

### collection.lastIndexOf(item) ⇒ <code>Number</code>
Gets the index of the last matching item.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 

<a name="Collection+includes"></a>

### collection.includes(item) ⇒ <code>Boolean</code>
Determines if an item exists in the collection.

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 

<a name="Collection+forEachRight"></a>

### collection.forEachRight(callback)
Like .forEach(), but starts on the last (greatest index) item and progresses backwards

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="Collection+someRight"></a>

### collection.someRight(callback) ⇒ <code>Boolean</code>
Like .some(), but starts on the last (greatest index) item and progresses backwards

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="Collection+find"></a>

### collection.find(matcher) ⇒ <code>Object</code>
Gets the first (lowest index) matching item from the collection.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: <code>Object</code> - - The item or undefined  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>function</code> \| <code>Object</code> | A function that returns true for a matched item, or an Object that represents the data you want to match. |

<a name="Collection+findLast"></a>

### collection.findLast(matcher) ⇒ <code>Object</code>
Gets the last (greatest index) matching item from the collection.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: <code>Object</code> - - The item or undefined  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>function</code> \| <code>Object</code> | A function that returns true for a matched item, or an Object that represents the data you want to match. |

<a name="Collection+map"></a>

### collection.map(callback) ⇒ [<code>Collection</code>](#Collection)
Returns a new collection with the results of calling a provided function on every element.

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Function that produces an element of the new Array, taking three arguments: the current item, index, and the collection. Context is also set to this collection. |

<a name="Collection+filter"></a>

### collection.filter(matcher) ⇒ [<code>Collection</code>](#Collection)
Gets all the matching items from the collection.

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>function</code> \| <code>Object</code> | A function that returns true for a matched item, or an Object that represents the data you want to match. |

<a name="Collection+findIndex"></a>

### collection.findIndex(matcher) ⇒ <code>Number</code>
Gets the index of the first (lowest index) matching item.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: <code>Number</code> - - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>function</code> \| <code>Object</code> | A function that returns true for a matched item, or an Object that represents the data you want to match. |

<a name="Collection+findLastIndex"></a>

### collection.findLastIndex(matcher) ⇒ <code>Number</code>
Gets the index of the last (greatest index) matching item.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: <code>Number</code> - - The index of the item or -1  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>function</code> \| <code>Object</code> | A function that returns true for a matched item, or an Object that represents the data you want to match. |

<a name="Collection+slice"></a>

### collection.slice(begin, [end]) ⇒ [<code>Collection</code>](#Collection)
Returns a shallow copy of a portion of the collection into a new collection selected from begin to end (end not included).

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| begin | <code>Object</code> |  | Index at which to begin extraction. |
| [end] | <code>Object</code> | <code>collection.length</code> | Index before which to end extraction |

<a name="Collection+sliceBy"></a>

### collection.sliceBy(beginMatcher, [endMatcher]) ⇒ [<code>Collection</code>](#Collection)
Like .slice(), but finds the begin and end indexes via matchers. (end is included)

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| beginMatcher | <code>Object</code> |  | A function that returns true for a matched item, or an Object that represents the data you want to match. |
| [endMatcher] | <code>Object</code> | <code>collection.length</code> | A function that returns true for a matched item, or an Object that represents the data you want to match. (end is included) |

<a name="Collection+flatten"></a>

### collection.flatten([settings]) ⇒ [<code>Collection</code>](#Collection)
Returns a new flattened collection

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>Object</code> |  |  |
| [settings.childKey] | <code>String</code> | <code>&#x27;children&#x27;</code> |  |
| [settings.saveDepth] | <code>Boolean</code> | <code>false</code> | if true appends a property "depth" to each returned object with the nested depth of the original object |
| [settings.onParent] | <code>function</code> |  | Called on every parent item. Provides two args: the parent item and that item's parent. Context is set to the Collection. If true is returned, then the children will not be flattened. |
| [settings.onChild] | <code>function</code> |  | Called on every child item. Provides two args: the child item and that item's parent. Context is set to the Collection. If true is returned, then this item (and any children) will not be included in the output. |

<a name="Collection+nest"></a>

### collection.nest([settings]) ⇒ [<code>Collection</code>](#Collection)
Returns a new nested collection

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>Object</code> |  |  |
| [settings.idKey] | <code>String</code> | <code>&#x27;ID&#x27;</code> | The ID property of items |
| [settings.parentKey] | <code>String</code> | <code>&#x27;parent&#x27;</code> | The key that holds the ID of the parent item |
| [settings.childKey] | <code>String</code> | <code>&#x27;children&#x27;</code> | The key to save children under. |
| [settings.deleteParentKey] | <code>String</code> | <code>false</code> | Should the parent key be deleted after nesting |

<a name="Collection+eachChild"></a>

### collection.eachChild(onChild, [settings])
Calls a callback for each nested child

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| onChild | <code>function</code> |  | Called for each item and child item. If true is returned, all iteration stops. Provides three args: the child item, the nested depth of the item, and the items parent. Context is set to this Collection. |
| [settings] | <code>Object</code> |  |  |
| [settings.childKey] | <code>String</code> | <code>children</code> | The key that contains children items |
| [settings.onParent] | <code>function</code> |  | Called for each item that contains children. If true is returned, then the children will not get processed. Provides the same args and context as the onChild callback. |

<a name="Collection+unique"></a>

### collection.unique([countKey]) ⇒ [<code>Collection</code>](#Collection)
Returns a new collection of unique items

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Description |
| --- | --- | --- |
| [countKey] | <code>String</code> | If provided records the number of duplicates, starting at 1 for unique items |

<a name="Collection+merge"></a>

### collection.merge(collections, idKey, callback) ⇒ [<code>Collection</code>](#Collection)
Merges this collection with one or more other collections. Returns a new collection.

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Description |
| --- | --- | --- |
| collections | <code>Colection</code> \| [<code>Array.&lt;Collection&gt;</code>](#Collection) | Either a collection or array of collections to merge with this collection. |
| idKey | <code>String</code> | The key to match items from the different collections. |
| callback | <code>function</code> | Called for each unique idKey value. Provides the same number of args as the total number of collections being merged, in the order provided. The returned value is included in the ouptput collection. |


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
