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