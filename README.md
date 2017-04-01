# Normalize Data
[![npm version](https://badge.fury.io/js/normalize-data.svg)](http://badge.fury.io/js/normalize-data)
[![CircleCI](https://circleci.com/gh/andreamangano/normalize-data.svg?style=svg)](https://circleci.com/gh/andreamangano/normalize-data)

The library easily normalizes simple and complex data structure
changing where necessary the properties values themselves.

Simply you can:
- rename the object properties
- change the property depth
- transform the properties values by dedicated functions

## Installation
Install the library as any other global npm package. Be sure to have npm, git and node installed.
If your computer already has these, just install the library with npm:

``` shell
$ npm install normalize-data
```

## Import

Import the library using require:

``` javascript
const n = require('normalize-data');
```

Otherwise, we can also include an ES2015 modules version:

``` javascript
import n from 'normalize-data';
```

## How to use the library
The following examples will show how to:
  - rename an object property
  - how to map a new object property on a previous one
  - apply a transformation function to change the property value

Let's suppose that we need to normalize the data structure below:

``` javascript
// Object structure before normalization
var obj = {
  name: "Mario Rossi",
  contacts: {
    email: "mariorossi@email.com",
    twitter: "@mariorossitweeter"
  },
  tags: 'Javascript, CSS, HTML',
  age: 30,
  description: 'This is a profile description.',
  hobbies: ['Golf', 'Football', 'Tennis']
};
```

First of all, we need to create a transformation map. It's a simple array of config that defines
how a set of object properties will change.

``` javascript
const n = require('normalize-data');

var transformMap = [
  ['fullName', 'name'], // [New property name, reference to old object property]
  ['email', 'contacts.email'], // Accepts nesting keys with dot syntax for the reference property
  ['info.description', 'description'],  // Accepts nesting keys for the new object property
  ['tags', 'tags', transformTagsIntoArray]  // Accepts transformation function
];

/*
  Transformation function to convert tags string into an array of strings
*/
function transformTagsIntoArray(tags) {
  return tags.replace(/\s/g, '').split(',');
}

console.log(n.normalize(obj, transformMap));

/* OUTPUT OBJECT:
 {
   fullName: 'Mario Rossi',
   email: 'mariorossi@email.com',
   info: { description: 'This is a profile description.' },
   tags: [ 'Javascript', 'CSS', 'HTML' ]
 }
*/
```

### Normalize an object preserving the previous object structure.

If you want to preserve the other object properties (not subjected to the normalization process),
you just need to set the `preserve` parameter to `true`:

``` javascript
console.log(n.normalize(obj, transformMap, true));

/* OUTPUT OBJECT:
 {
   contacts: { twitter: '@mariorossitweeter' },
   tags: [ 'Javascript', 'CSS', 'HTML' ],
   age: 30,
   hobbies: [ 'Golf', 'Football', 'Tennis' ],
   fullName: 'Mario Rossi',
   email: 'mariorossi@email.com',
   info: { description: 'This is a profile description.' }
 }
*/
```

## Transformation Functions
They aim to change a given property value.
A transformation function takes the property value as first argument by default.

``` javascript
/*
  Example of transformation function to convert tags string into an array.
  The first function parameter has to be the value to normalize.
*/
function transformTagsIntoArray(tags) {
  return tags.replace(/\s/g, '').split(',');
}

/*
  The transformation map has to be defined as third parameters of the item array of config.
*/
var transformMap = [
  ...,
  ['tags', 'tags', transformTagsIntoArray],  // transformation function
  ...
];

console.log(n.normalize(obj, transformMap));

/* OUTPUT OBJECT:
 {
   ...,
   tags: ['Javascript', 'CSS', 'HTML']
   ...
 }
*/
```

It's possible to pass optional parameters to the transformation functions:

``` javascript
/*
  Transformation function that takes the n first hobbies from the given array.
  1 optional parameter (n)
*/
function takeFirstNHobbies(hobbies, n) {
  return hobbies.slice(0, n);
}

/*
  Transformation function that replaces the given words with a replacement string.
  Two optional parameters:

  - words: Array of strings that have to be replaced
  - replacement: string replacement
*/
function filterWords(text, words, replacement) {
  const regex = new RegExp(words.join("|"),"gi");
  return text.replace(regex, replacement);
};

var transformMap = [
  ...,
  ['hobbies', 'hobbies', takeFirstNHobbies, 2], // One options parameter only (2)
  ['info.description', 'description', filterWords,
    [
      ['is', 'profile'],
      '***'
    ] // Two optional parameters passed as array of values
  ]
  ...
];

console.log(n.normalize(obj, transformMap));

/* OUTPUT OBJECT:
{
  ...,
  hobbies: [ 'Golf', 'Football' ],
  info: { description: 'Th*** *** a *** description.' },
  ...
}
*/
```

## Methods

### .normalize(obj, map, preserve)
Normalizes a given object `obj` according to the transformation `map`.
Optionally set `preserve` to true for preserving the initial object structure. It will default to false.


## Transformation Map
It's a simple array of config that defines how a set of object properties will change.

The configuration for a single object property has at most four parameters:
- the new property name (required)
- the old property name (required)
- a transformationFunction (optional)
- a set of optional parameters (optional)

> Note: The parameters for the new and old property names accept nesting keys with dot syntax.

``` javascript

var transformMap = [
  ...,
  ["New property name", "Old property name", transformFunction, optionalParameters]
  ...
]
```

#### Example 1

``` javascript
// Example 1: Renames an object property

var transformMap = [
  ...,
  ["fullName", "name"] // The property "name" of the initial object will be renamed in "fullName"
  ...
]
```

#### Example 2

``` javascript
// Example 2: Renames a object property using nesting keys

var transformMap = [
  ...,
  ["info.fullName", "name"], // The property "name" of the initial object will be renamed in "fullName" that will become a key of the info propery object.
  ...
]
```

#### Example 3

``` javascript
// Example 2: Renames a object property using nesting keys and capitalizes the property value

function capitalize(name) {
  ...
}

var transformMap = [
  ...,
  ["fullName", "name", capitalize], // No extra parameters for the function
  ...
]
```

#### Example 4

``` javascript
// Example 2: Renames a object property using nesting keys and capitalizes the property value

function transformationFuncX(name, optionalParam1, optionalParameter2) {
  ...
}

var transformMap = [
  ...,
  ["fullName", "name", transformationFuncX, [optionalParam1, optionalParameter2]],
  ...
]
```

## Author

> [andreamangano.com](http://andreamangano.com) · Twitter [@andreaman87](https://twitter.com/andreaman87)


## License

Licensed under [MIT License](LICENSE). © Andrea Mangano.
