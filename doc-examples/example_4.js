/*
 Goal: Rename an object property capitalizing the property value
 */

var n = require('normalize-data');

// Capitalizes the first letter of the name
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

var objToNormalize = {
  name: 'mario', // First letter of the "Name" not capitalized
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