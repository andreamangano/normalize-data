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

// Note that we're using the "preserve" parameter to true for preserving the old object structure
console.log(n.normalize(objToNormalize, transformMap, true));

var transformMap = [
  ['hobbies.0', 'hobby1'],
  ['hobbies.1', 'hobby2'],
  ['hobbies.2', 'hobby3']
];

// Note that we're using the "preserve" parameter to true for preserving the old object structure
console.log(n.normalize(objToNormalize, transformMap, true));

/* OUTPUT OBJECT:
 {
   name: 'Mario',
   surname: 'Rossi',
   hobbies: ['Golf', 'Football', 'Tennis']
 }
 */