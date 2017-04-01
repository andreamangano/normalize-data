import objPath from 'object-path';

const normalize = (obj, map, preserve = false) => {
  // Initial object for the normalization process will be a copy
  // of the "obj" parameter whether the "preserve" parameter is set to true.
  const initialObj = preserve ? Object.assign({}, obj) : {};

  // The reduce function builds the normalized object by using the transformation map
  // The accumulator for the reduce function is the initial object instance previously
  return map.reduce((acc, elem) => {
    // Gets the property value from the old object property by using if necessary
    // the dot notation for the nested keys
    let value = objPath.get(obj, elem[1]);
    // If the property value exists
    if (value) {
      // If the transformation function exists
      if (elem[2] && typeof (elem[2]) === 'function') {
        // Checks if there are optional parameters for the function
        // then concats the default parameter (the property value) with the optional ones
        const args = elem[3] ? [value].concat(elem[3]) : [value];
        // Applies the function
        value = elem[2].apply(this, args);
      }
      // Sets the value of the new property into the new object structure
      // Uses object-path "set" function for handling nested keys
      objPath.set(acc, elem[0], value);
      // If the old key is not equal to the new one
      if (preserve && elem[0] !== elem[1]) {
        // Removes the old key from the data structure
        objPath.del(initialObj, elem[1]);
      }
    }
    return acc;
  }, initialObj);
};

module.exports = {
  normalize
};
