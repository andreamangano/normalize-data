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

