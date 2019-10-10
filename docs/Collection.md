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


<br><a name="Collection"></a>

### Collection ⇐ <code>Array</code>
``` javascriptimport { Collection } from 'hord';```
**Extends**: <code>Array</code>  

* [Collection](#Collection) ⇐ <code>Array</code>
    * [new Collection()](#new_Collection_new)
    * [.length](#Collection+length) : <code>Number</code>
    * _Add / Remove_
        * [.push(item)](#Collection+push) ⇒ <code>Number</code>
        * [.pop()](#Collection+pop) ⇒ <code>\*</code>
        * [.unshift(item)](#Collection+unshift) ⇒ <code>Number</code>
        * [.shift()](#Collection+shift) ⇒ <code>\*</code>
    * _Immutable Queries_
        * [.indexOf(item)](#Collection+indexOf) ⇒ <code>Number</code>
        * [.lastIndexOf(item)](#Collection+lastIndexOf) ⇒ <code>Number</code>
        * [.includes(item)](#Collection+includes) ⇒ <code>Boolean</code>
        * [.findIndex(predicate)](#Collection+findIndex) ⇒ <code>Number</code>
        * [.findLastIndex(predicate)](#Collection+findLastIndex) ⇒ <code>Number</code>
        * [.find(predicate)](#Collection+find) ⇒ <code>Object</code>
        * [.findLast(predicate)](#Collection+findLast) ⇒ <code>Object</code>
        * [.filter(predicate)](#Collection+filter) ⇒ [<code>Collection</code>](#Collection)
        * [.sliceBy(beginPredicate, [endPredicate])](#Collection+sliceBy) ⇒ [<code>Collection</code>](#Collection)
    * _Immutable Retrieval_
        * [.first()](#Collection+first) ⇒ <code>Object</code>
        * [.last()](#Collection+last) ⇒ <code>Object</code>
        * [.slice(begin, [end])](#Collection+slice) ⇒ [<code>Collection</code>](#Collection)
        * [.flatten([settings])](#Collection+flatten) ⇒ [<code>Collection</code>](#Collection)
        * [.nest([settings])](#Collection+nest) ⇒ [<code>Collection</code>](#Collection)
        * [.unique([countKey])](#Collection+unique) ⇒ [<code>Collection</code>](#Collection)
        * [.merge(collections, idKey, callback)](#Collection+merge) ⇒ [<code>Collection</code>](#Collection)
        * [.concat(value)](#Collection+concat) ⇒ [<code>Collection</code>](#Collection)
        * [.toString()](#Collection+toString) ⇒ <code>String</code>
        * [.toLocaleString([locales], [options])](#Collection+toLocaleString) ⇒ <code>String</code>
        * [.join([separator])](#Collection+join) ⇒ <code>String</code>
        * [.entries()](#Collection+entries) ⇒ <code>Iterator</code>
        * [.values()](#Collection+values) ⇒ <code>Iterator</code>
        * [.keys()](#Collection+keys) ⇒ <code>Object</code>
    * _Iterative_
        * [.forEach(callback, [thisArg])](#Collection+forEach) ↩︎
        * [.forEachRight(callback, [thisArg])](#Collection+forEachRight) ↩︎
        * [.some(callback, [thisArg])](#Collection+some) ⇒ <code>Boolean</code>
        * [.someRight(callback, [thisArg])](#Collection+someRight) ⇒ <code>Boolean</code>
        * [.every(callback, [thisArg])](#Collection+every) ⇒ <code>Boolean</code>
        * [.reduce(callback, [thisArg])](#Collection+reduce) ⇒ <code>\*</code>
        * [.reduceRight(callback, [thisArg])](#Collection+reduceRight) ⇒ <code>\*</code>
        * [.map(callback, thisArg)](#Collection+map) ⇒ [<code>Collection</code>](#Collection)
        * [.eachChild(onChild, [settings])](#Collection+eachChild)
        * [.flat([depth])](#Collection+flat) ⇒ [<code>Collection</code>](#Collection)
        * [.flatMap(callback, thisArg)](#Collection+flatMap) ⇒ [<code>Collection</code>](#Collection)
    * _Mutable_
        * [.model()](#Collection+model) ⇒ <code>Model</code>
        * [.remove()](#Collection+remove)
        * [.copyWithin(target, [start], [end])](#Collection+copyWithin) ↩︎
        * [.fill(value, [start], [end])](#Collection+fill) ↩︎
        * [.reverse()](#Collection+reverse) ↩︎
        * [.sort([compareFunction])](#Collection+sort) ↩︎
        * [.splice(start, [deleteCount])](#Collection+splice) ⇒ [<code>Collection</code>](#Collection)


<br><a name="new_Collection_new"></a>

#### new Collection()
> An array of objects with optional model enforcement and indexed queries. For info on indexing, see Collection.[model](#Collection+model).> > The collection class uses the [on-change](https://github.com/sindresorhus/on-change) library (uses the [`Proxy` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)) to detect changes and maintain model enforcement and indexing.


| Type | Description |
| --- | --- |
| <code>Array</code>, <code>Object</code> | Accepts an array of objects or multiple args of objects. |


<br><a name="Collection+length"></a>

#### collection.length : <code>Number</code>
_`✎ Updates indexes`_
> Set or return the number of elements in the collection.

**See**: [Array.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length)  

<br><a name="Collection+push"></a>

#### collection.push(item) ⇒ <code>Number</code>
_`✎ Updates indexes`_
> Add an item to the end of the collection.

**Returns**: <code>Number</code> - The new length of the collection  
**See**: [Array.prototype.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)  

| Param | Type |
| --- | --- |
| item | <code>\*</code> | 


<br><a name="Collection+pop"></a>

#### collection.pop() ⇒ <code>\*</code>
_`✎ Updates indexes`_
> Remove the last item from the collection and return it.

**See**: [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)  

<br><a name="Collection+unshift"></a>

#### collection.unshift(item) ⇒ <code>Number</code>
_`✎ Updates indexes`_
> Add an item to the beginning of the collection.

**Returns**: <code>Number</code> - The new length of the collection  
**See**: [Array.prototype.unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)  

| Param | Type |
| --- | --- |
| item | <code>\*</code> | 


<br><a name="Collection+shift"></a>

#### collection.shift() ⇒ <code>\*</code>
_`✎ Updates indexes`_
> Remove the first item from the collection and return it.

**See**: [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)  

<br><a name="Collection+indexOf"></a>

#### collection.indexOf(item) ⇒ <code>Number</code>
_`⚡ Utilizes indexes`_
> Gets the index of the item using exact equality.

**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 


<br><a name="Collection+lastIndexOf"></a>

#### collection.lastIndexOf(item) ⇒ <code>Number</code>
_`⚡ Utilizes indexes`_
> Gets the index of the last matching item.

**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 


<br><a name="Collection+includes"></a>

#### collection.includes(item) ⇒ <code>Boolean</code>
_`⚡ Utilizes indexes`_
> Determines if an item exists in the collection.


| Param | Type |
| --- | --- |
| item | <code>Object</code> | 


<br><a name="Collection+findIndex"></a>

#### collection.findIndex(predicate) ⇒ <code>Number</code>
_`⚡ Utilizes indexes`_
> Gets the index of the first (lowest index) matching item.

**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type |
| --- | --- |
| predicate | [<code>predicate</code>](#predicate) | 


<br><a name="Collection+findLastIndex"></a>

#### collection.findLastIndex(predicate) ⇒ <code>Number</code>
_`⚡ Utilizes indexes`_
> Gets the index of the last (greatest index) matching item.

**Returns**: <code>Number</code> - The index of the item or -1  

| Param | Type |
| --- | --- |
| predicate | [<code>predicate</code>](#predicate) | 


<br><a name="Collection+find"></a>

#### collection.find(predicate) ⇒ <code>Object</code>
_`⚡ Utilizes indexes`_
> Gets the first (lowest index) matching item from the collection.

**Returns**: <code>Object</code> - The item or undefined  

| Param | Type |
| --- | --- |
| predicate | [<code>predicate</code>](#predicate) | 


<br><a name="Collection+findLast"></a>

#### collection.findLast(predicate) ⇒ <code>Object</code>
_`⚡ Utilizes indexes`_
> Gets the last (greatest index) matching item from the collection.

**Returns**: <code>Object</code> - The item or undefined  

| Param | Type |
| --- | --- |
| predicate | [<code>predicate</code>](#predicate) | 


<br><a name="Collection+filter"></a>

#### collection.filter(predicate) ⇒ [<code>Collection</code>](#Collection)
_`⚡ Utilizes indexes`_
> Gets all the matching items from the collection.

**Returns**: [<code>Collection</code>](#Collection) - A new Collection with the same model as the calling collection.  

| Param | Type |
| --- | --- |
| predicate | [<code>predicate</code>](#predicate) | 


<br><a name="Collection+sliceBy"></a>

#### collection.sliceBy(beginPredicate, [endPredicate]) ⇒ [<code>Collection</code>](#Collection)
_`⚡ Utilizes indexes`_
> Like .slice(), but finds the begin and end indexes via predicates. (end is included)

**Returns**: [<code>Collection</code>](#Collection) - A new Collection with the same model as the calling collection.  

| Param | Type | Default |
| --- | --- | --- |
| beginPredicate | [<code>predicate</code>](#predicate) |  | 
| [endPredicate] | [<code>predicate</code>](#predicate) | <code>collection.length</code> | 


<br><a name="Collection+first"></a>

#### collection.first() ⇒ <code>Object</code>
> Gets the first item in the collection without removing it.


<br><a name="Collection+last"></a>

#### collection.last() ⇒ <code>Object</code>
> Gets the last item in the collection without removing it.


<br><a name="Collection+slice"></a>

#### collection.slice(begin, [end]) ⇒ [<code>Collection</code>](#Collection)
> Returns a shallow copy of a portion of the collection selected from begin to end (end not included).

**Returns**: [<code>Collection</code>](#Collection) - A new Collection with the same model as the calling collection.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| begin | <code>Object</code> |  | Index at which to begin extraction. |
| [end] | <code>Object</code> | <code>collection.length</code> | Index before which to end extraction |


<br><a name="Collection+flatten"></a>

#### collection.flatten([settings]) ⇒ [<code>Collection</code>](#Collection)
> Returns a new flattened collection

**Returns**: [<code>Collection</code>](#Collection) - A new Collection with the same model as the calling collection.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>Object</code> |  |  |
| [settings.childKey] | <code>String</code> | <code>&#x27;children&#x27;</code> |  |
| [settings.saveDepth] | <code>Boolean</code> | <code>false</code> | if true appends a property "depth" to each returned object with the nested depth of the original object |
| [settings.onParent] | <code>function</code> |  | Called on every parent item. Provides two args: the parent item and that item's parent. Context is set to the Collection. If true is returned, then the children will not be flattened. |
| [settings.onChild] | <code>function</code> |  | Called on every child item. Provides two args: the child item and that item's parent. Context is set to the Collection. If true is returned, then this item (and any children) will not be included in the output. |


<br><a name="Collection+nest"></a>

#### collection.nest([settings]) ⇒ [<code>Collection</code>](#Collection)
_`⚡ Utilizes indexes`_
> Returns a new nested collection

**Returns**: [<code>Collection</code>](#Collection) - A new Collection without a model.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>Object</code> |  |  |
| [settings.idKey] | <code>String</code> | <code>&#x27;id&#x27;</code> | The id property of items |
| [settings.parentKey] | <code>String</code> | <code>&#x27;parent&#x27;</code> | The key that holds the id of the parent item. _Performance improvement if indexed_ |
| [settings.childKey] | <code>String</code> | <code>&#x27;children&#x27;</code> | The key to save children under. _Performance improvement if indexed_ |
| [settings.deleteParentKey] | <code>String</code> | <code>false</code> | Should the parent key be deleted after nesting |


<br><a name="Collection+unique"></a>

#### collection.unique([countKey]) ⇒ [<code>Collection</code>](#Collection)
_`⚡ Utilizes indexes`_
> Returns a new collection of deeply unique items

**Returns**: [<code>Collection</code>](#Collection) - A new Collection with the same model as the calling collection.  

| Param | Type | Description |
| --- | --- | --- |
| [countKey] | <code>String</code> | If provided records the number of duplicates, starting at 1 for unique items |


<br><a name="Collection+merge"></a>

#### collection.merge(collections, idKey, callback) ⇒ [<code>Collection</code>](#Collection)
_`⚡ Utilizes indexes`_
> Merges this collection with one or more other collections. Returns a new collection.

**Returns**: [<code>Collection</code>](#Collection) - A new Collection with the same model as the calling collection.  

| Param | Type | Description |
| --- | --- | --- |
| collections | <code>Colection</code>, [<code>Array.&lt;Collection&gt;</code>](#Collection) | Either a collection or array of collections to merge with this collection. |
| idKey | <code>String</code> | The key to match items from the different collections. |
| callback | <code>function</code> | Called for each unique idKey value. Provides the same number of args as the total number of collections being merged, in the order provided. The returned value is included in the ouptput collection. |


<br><a name="Collection+concat"></a>

#### collection.concat(value) ⇒ [<code>Collection</code>](#Collection)
> Returns a shallow clone of this collection with the contents of one or more arrays or collections appended.

**See**: [Array.prototype.concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Array</code>, [<code>Collection</code>](#Collection) | One or more arrays |


<br><a name="Collection+toString"></a>

#### collection.toString() ⇒ <code>String</code>
**See**: [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)  

<br><a name="Collection+toLocaleString"></a>

#### collection.toLocaleString([locales], [options]) ⇒ <code>String</code>
**See**: [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)  

| Param | Type |
| --- | --- |
| [locales] | <code>Array</code> | 
| [options] | <code>Object</code> | 


<br><a name="Collection+join"></a>

#### collection.join([separator]) ⇒ <code>String</code>
**See**: [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)  

| Param | Type | Default |
| --- | --- | --- |
| [separator] | <code>String</code> | <code>&#x27;,&#x27;</code> | 


<br><a name="Collection+entries"></a>

#### collection.entries() ⇒ <code>Iterator</code>
**See**: [Array.prototype.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries)  

<br><a name="Collection+values"></a>

#### collection.values() ⇒ <code>Iterator</code>
**See**: [Array.prototype.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values)  

<br><a name="Collection+keys"></a>

#### collection.keys() ⇒ <code>Object</code>
**See**: [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)  

<br><a name="Collection+forEach"></a>

#### collection.forEach(callback, [thisArg]) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Calls a provided callback once for each array element in order starting at 0.> Unlike the native forEach, this one returns an instance of collection for chaining.

**See**: [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)  

| Param | Type | Default |
| --- | --- | --- |
| callback | <code>function</code> |  | 
| [thisArg] | <code>\*</code> | <code>this</code> | 


<br><a name="Collection+forEachRight"></a>

#### collection.forEachRight(callback, [thisArg]) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

> Like .forEach(), but starts on the last (greatest index) item> and progresses backwards


| Param | Type | Default |
| --- | --- | --- |
| callback | <code>function</code> |  | 
| [thisArg] | <code>\*</code> | <code>this</code> | 


<br><a name="Collection+some"></a>

#### collection.some(callback, [thisArg]) ⇒ <code>Boolean</code>
**See**: [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="Collection+someRight"></a>

#### collection.someRight(callback, [thisArg]) ⇒ <code>Boolean</code>
> Like .some(), but starts on the last (greatest index) item and progresses backwards


| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="Collection+every"></a>

#### collection.every(callback, [thisArg]) ⇒ <code>Boolean</code>
**See**: [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="Collection+reduce"></a>

#### collection.reduce(callback, [thisArg]) ⇒ <code>\*</code>
**See**: [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="Collection+reduceRight"></a>

#### collection.reduceRight(callback, [thisArg]) ⇒ <code>\*</code>
**See**: [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| [thisArg] | <code>Object</code> | 


<br><a name="Collection+map"></a>

#### collection.map(callback, thisArg) ⇒ [<code>Collection</code>](#Collection)
> Returns a new collection with the results of calling a provided> function on every element.

**Returns**: [<code>Collection</code>](#Collection) - A new Collection without a model.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Function that produces an element of the new Array, taking three arguments: the current item, index, and the collection. Context is also set to this collection. |
| thisArg | <code>\*</code> | Applied to the context of the callback |


<br><a name="Collection+eachChild"></a>

#### collection.eachChild(onChild, [settings])
> Calls a callback for each nested child


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| onChild | <code>function</code> |  | Called for each item and child item. If true is returned, all iteration stops. Provides three args: the child item, the nested depth of the item, and the items parent. Context is set to this Collection. |
| [settings] | <code>Object</code> |  |  |
| [settings.childKey] | <code>String</code> | <code>children</code> | The key that contains children items |
| [settings.onParent] | <code>function</code> |  | Called for each item that contains children. If true is returned, then the children will not get processed. Provides the same args and context as the onChild callback. |


<br><a name="Collection+flat"></a>

#### collection.flat([depth]) ⇒ [<code>Collection</code>](#Collection)
> Creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.

**Returns**: [<code>Collection</code>](#Collection) - A new Collection without a model.  
**See**: [Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)  

| Param | Type | Default |
| --- | --- | --- |
| [depth] | <code>Number</code> | <code>1</code> | 


<br><a name="Collection+flatMap"></a>

#### collection.flatMap(callback, thisArg) ⇒ [<code>Collection</code>](#Collection)
> Maps each element using a mapping function, then flattens the result into a new array. Same as .map().flat().

**Returns**: [<code>Collection</code>](#Collection) - A new Collection without a model.  
**See**: [Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 
| thisArg | <code>\*</code> | 


<br><a name="Collection+model"></a>

#### collection.model() ⇒ <code>Model</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

_`✎ Builds indexes`_
> A model that gets enforced on every item in the collection.> To create indexes, add 'index: true' to the schema type definition> like in the example below.


| Type | Description |
| --- | --- |
| <code>Model</code>, <code>Object</code> | Can be an instance of class:Model or an object with a schema structure. |

**Example**  
``` javascriptimport { Collection, Model } from 'hord';const Person = new Model({    id: {        type: Number,        index: true    },    first: {        type: String,        index: true    },    last: {        type: String,        index: true    },    age: Number});const people = new Collection().model(Person);// ORconst people = new Collection().model({    id: {        type: Number,        index: true    },    first: {        type: String,        index: true    },    last: {        type: String,        index: true    },    age: Number});```

<br><a name="Collection+remove"></a>

#### collection.remove()
> Removes all model onChange events and indexes and empties the collection.


<br><a name="Collection+copyWithin"></a>

#### collection.copyWithin(target, [start], [end]) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

_`⚠ Forces a rebuild of all indexes`_
> Shallow copies a portion of the collection to another location within the collection.

**See**: [Array.prototype.copyWithin()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)  

| Param | Type |
| --- | --- |
| target | <code>Number</code> | 
| [start] | <code>Number</code> | 
| [end] | <code>Number</code> | 


<br><a name="Collection+fill"></a>

#### collection.fill(value, [start], [end]) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

_`⚠ Forces a rebuild of all indexes`_
> Fills all or a portion of the collection with a static value.

**See**: [Array.prototype.fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 
| [start] | <code>Number</code> | 
| [end] | <code>Number</code> | 


<br><a name="Collection+reverse"></a>

#### collection.reverse() ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

_`⚠ Forces a rebuild of all indexes`_
> Reverses the order of items in place.

**See**: [Array.prototype.reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)  

<br><a name="Collection+sort"></a>

#### collection.sort([compareFunction]) ↩︎&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔗 Chainable`_

_`⚠ Forces a rebuild of all indexes`_
> Sort the contents of the collection in place.

**See**: [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)  

| Param | Type |
| --- | --- |
| [compareFunction] | <code>function</code> | 


<br><a name="Collection+splice"></a>

#### collection.splice(start, [deleteCount]) ⇒ [<code>Collection</code>](#Collection)
_`✎ Updates indexes`_
> Changes the contents of an collection in place by removing or replacing existing elements and/or adding new elements

**Returns**: [<code>Collection</code>](#Collection) - A new Collection with the same model as the calling collection. Contains the elements removed from the calling collection.  
**See**: [Array.prototype.splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)  

| Param | Type |
| --- | --- |
| start | <code>Number</code> | 
| [deleteCount] | <code>Number</code> | 
| [item1, item2, ...] | <code>\*</code> | 


<br><a name="predicate"></a>

### predicate : <code>function</code> \| <code>Object</code>
Can be either of the following:- A function that accepts one item from the collection and returns true to indicate a match.- A query object that is deeply compared to items in the collection. Available operators are outlined below.#### Query Operators##### $eq (EQual)The same as not providing any operator. Uses SameValue equality.``` javascript{age: 23}// OR{age: {$eq: 23}}```<br>##### $ne (Not Equal)Like $eq, $ne uses SameValue equality, but matches values that don't equal.``` javascript{age: {$ne: 23}}```<br>##### $in (IN)Matches any item in an array.``` javascript{age: {$in: [20, 30, 40]}}```<br>##### $nin (Not IN)Matches any item not in an array.``` javascript{age: {$nin: [20, 30, 40]}}```<br>##### $gt (Greater Than)Matches values greater than the provided value``` javascript{age: {$gt: 21}}```<br>##### $gte (Greater Than or Equal)Matches values greater than the provided value``` javascript{age: {$gte: 21}}```<br>##### $lt (Less Than)Matches values greater than the provided value``` javascript{age: {$lt: 21}}```<br>##### $lte (Less Than or Equal)Matches values greater than the provided value``` javascript{age: {$lte: 21}}```
> If you haven't set up any indexes, or you're searching on properties that aren't indexed, then providing a function will most likely have better performance. If you're searching on even one property that's indexed, then using an object will perform better, as the indexer can narrow the search before iterating over the results for a final match.


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
