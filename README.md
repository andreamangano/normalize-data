# Normalize Data
[![npm version](https://badge.fury.io/js/normalize-data.svg)](http://badge.fury.io/js/normalize-data)
[![CircleCI](https://circleci.com/gh/andreamangano/normalize-data.svg?style=shield)](https://circleci.com/gh/andreamangano/normalize-data)
[![codecov](https://codecov.io/gh/andreamangano/normalize-data/branch/master/graph/badge.svg)](https://codecov.io/gh/andreamangano/normalize-data)

The library easily normalizes simple and complex data structure
changing where necessary the properties values themselves.

Simply you can:
- rename the object properties
- change the property depth
- transform the properties values by dedicated functions
- create a new object property starting from another object properties

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
  - map a new object property on a previous one
  - apply a transformation function to change the property value

Let's suppose that we need to normalize the data structure below:

``` javascript
// Object structure before normalization
var obj = {
  name: 'Mario Rossi',
  contacts: {
    email: 'mariorossi@email.com',
    twitter: '@mariorossitweeter'
  },
  tags: 'Javascript, CSS, HTML',
  age: 30,
  description: 'This is a profile description.',
  hobbies: ['Golf', 'Football', 'Tennis']
};
```

First of all, we need to create a transformation map. It's a simple array of config that defines how a set of object properties will change.

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
// The example here takes the same "transformMap" of the previous example
console.log(n.normalize(obj, transformMap, true));

/* OUTPUT OBJECT:
 {
   contacts: { twitter: '@mariorossitweeter' }, // Preserved property
   tags: [ 'Javascript', 'CSS', 'HTML' ],
   age: 30, // Preserved property
   hobbies: [ 'Golf', 'Football', 'Tennis' ], // Preserved property
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
  [
    'hobbies', // New property name
    'hobbies', // Old property name
    takeFirstNHobbies, // Transformation function
    2 // One option parameter only
  ],
  [
    'info.description', // New property name
    'description', // Old property name
    filterWords, // Transformation function
    [ ['is', 'profile'], '***' ] // Two optional parameters passed as array of values
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
- the old property name (required). It could be an Array of old properties names.
- a transformationFunction (optional)
- a set of optional parameters (optional)

> Note: The parameters for the new and old property names accept nesting keys with dot syntax.

``` javascript

var transformMap = [
  ...,
  [
    "New property name", // Required
    "Old property name" | ["Old property name 1", "Old property name 2", ...], // Required
    transformFunction, // Not required
    optionalParameter | [optionalParameter1, optionalParameter2, ...] // Not required
  ]
  ...
]
```

## Examples

### Example 1: Rename an object property.

#### Abstract

``` javascript
   var objectToNormalize = {
     ...,
     property: value,
     ...
   };
   
   var transformMap = {
     ...,
     [ 'newPropertyName', 'oldPropertyName' ], // Config item
     ...
   };
   
   n.normalize(objToNormalize, transformMap, ...);
   
   /* OUTPUT OBJECT:
   {
      ...,
      newPropertyName: value,
      ...
   }
   */
```

#### Practical

``` javascript
var n = require('normalize-data');

var objToNormalize = {
  name: 'Mario',
  surname: 'Rossi',
  years: 30
};

var transformMap = [
  ['age', 'years'] // The property "years" of the initial object will be renamed in "age"
];

// Note that we're using the "preserve" parameter to true for preserving the old object structure
console.log(n.normalize(objToNormalize, transformMap, true));

/* OUTPUT OBJECT:
{
  name: 'Mario',
  surname: 'Rossi',
  age: 30
}
*/
```

### Example 2
Goal: Remap a set of object properties inside a new one.

#### Abstract

``` javascript
  var objectToNormalize = {
    ...,
    property1: value1,
    property2: value2,
    ...
  };
  
  var transformMap = {
    ...,
    [ 'newPropertyName.newNameForProperty1', 'property1'], // Uses dot notation
    [ 'newPropertyName.newNameForProperty2', 'property2'], // Uses dot notation
    ...
  };
   
  n.normalize(objToNormalize, transformMap, ...);
   
  /* OUTPUT OBJECT:
  {
    ...,
    newPropertyName: {
      newNameForProperty1: value1,
      newNameForProperty2: value2
    }
    ...
  }
  */
```

#### Practical

``` javascript
var n = require('normalize-data');

var objToNormalize = {
  name: 'Mario',
  surname: 'Rossi',
  street: '803 11th Avenue',
  state: 'California',
  postalCode: '94089'
};

var transformMap = [
  ['address.street', 'street'],
  ['address.state', 'state'],
  ['address.postalCode', 'postalCode']
];

// Note that we're using the "preserve" parameter to true for preserving the old object structure
console.log(n.normalize(objToNormalize, transformMap, true));

/* OUTPUT OBJECT:
{
  name: 'Mario',
  surname: 'Rossi',
  address: {
    street: '803 11th Avenue',
    state: 'California',
    postalCode: '94089'
  }
}
*/
```

### Example 3
Goal: Collect property values inside a new object property.
The example shows how to create a new object property whose value is an array that contains another property values.

#### Abstract

``` javascript
  var objectToNormalize = {
    ...,
    property1: value1,
    property2: value2,
    ...
  };
  
  var transformMap = {
    ...,
    [ 'newPropertyName', [ 'property1', 'property2' ],
    ...
  };
   
  n.normalize(objToNormalize, transformMap, ...);
   
  /* OUTPUT OBJECT:
  {
    ...,
    newPropertyName: [ value1, value2 ],
    ...
  }
  */
```

#### Practical

``` javascript
var n = require('normalize-data');

var objToNormalize = {
  name: 'Mario',
  surname: 'Rossi',
  hobby1: 'Golf',
  hobby2: 'Football',
  hobby3: 'Tennis'
};

var transformMap = [
  ['hobbies', ['hobby1', 'hobby2', 'hobby3']]
];

/*
  Alternative transformMap that you could use to achieve the same goal:
  
  var transformMap = [
    ['hobbies.0', 'hobby1'],
    ['hobbies.1', 'hobby2'],
    ['hobbies.2', 'hobby3']
  ];
*/

// Note that we're using the "preserve" parameter to true for preserving the old object structure
console.log(n.normalize(objToNormalize, transformMap, true));

/* OUTPUT OBJECT:
{
  name: 'Mario',
  surname: 'Rossi',
  hobbies: ['Golf', 'Football', 'Tennis']
}
*/
```

### Example 4
Goal: Create a new object property by using a transformation map.

#### Abstract
``` javascript
  var objectToNormalize = {
    ...,
    property: value
    ...
  };
  
  function transformFunc(oldPropertyValue) {
    return ...;
  }
  
  var transformMap = {
    ...,
    ['newPropertyName', 'oldPropertyName', transformFunction],
    ...
  };
   
  n.normalize(objToNormalize, transformMap, ...);
   
  /* OUTPUT OBJECT:
  {
    ...,
    newPropertyName: transformFunc(oldPropertyValue), // The return value of the transformation function
    ...
  }
  */
```

#### Practical

``` javascript
var n = require('normalize-data');

// Capitalizes the first letter of the name
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

var objToNormalize = {
  name: 'mario',
  surname: 'Rossi'
};

var transformMap = [
  ['name', 'name', capitalize] // Note that function hasn't extra parameters
];

// Note that we're using the "preserve" parameter to true for preserving the old object structure
console.log(n.normalize(objToNormalize, transformMap, true));

/* OUTPUT OBJECT:
{
  name: 'Mario',
  surname: 'Rossi'
}
*/
```

### Example 5
Goal: Create a new object property by using a transformation map with extra parameters.

#### Abstract
``` javascript
var objectToNormalize = {
  ...,
  property: value
  ...
};
  
function transformFunc(oldPropertyValue, optionalParam1, optionalParameter2, ...) {
  return ...;
}

var transformMap = [
  ...,
  ['newPropertyName', 'oldPropertyName', transformFunc, [optionalParam1, optionalParameter2, ...]],
  ...
];
 
n.normalize(objToNormalize, transformMap, ...);
 
/* OUTPUT OBJECT:
{
  ...,
  newPropertyName: transformFunc(oldPropertyValue, optionalParam1, optionalParameter2, ...), // The return value of the transformation function
  ...
}
*/
```

#### Practical

``` javascript
var n = require('normalize-data');

var objToNormalize = {
  name: 'Mario',
  surname: 'Rossi',
  hobbies: ['Golf', 'Football', 'Tennis']
};

function takeFirstNHobbies(hobbies, n) {
  var _hobbies = hobbies.slice(0, n);
  return _hobbies.length > 1 ? _hobbies : _hobbies.join();
}

var transformMap = [
  ['hobbies', 'hobbies', takeFirstNHobbies, 2]
];

// Note that we're using the "preserve" parameter to true for preserving the old object structure
console.log(n.normalize(objToNormalize, transformMap, true));

/* OUTPUT OBJECT:
 {
   name: 'Mario',
   surname: 'Rossi',
   hobbies: [ 'Golf', 'Football' ]
 }
 */
```

## Author

> [andreamangano.com](http://andreamangano.com) · Twitter [@andreaman87](https://twitter.com/andreaman87)


## License

Licensed under [MIT License](LICENSE). © Andrea Mangano.
