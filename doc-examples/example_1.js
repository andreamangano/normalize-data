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