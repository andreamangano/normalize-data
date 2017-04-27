import objPath from 'object-path';

const normalize = (obj, map, preserve = false) => {
  // Initial object for the normalization process will be a copy
  // of the "obj" parameter whether the "preserve" parameter is set to true.
  const initialObj = preserve ? Object.assign({}, obj) : {};
  // The reduce function builds the normalized object by using the transformation map
  // The accumulator for the reduce function is the initial object instance previously
  return map.reduce((acc, elem) => {
    let value;
    const p1 = elem[0];
    const p2 = elem[1];
    const p3 = elem[2] || false;
    const p4 = elem[3] || false;
    // Gets the property value from the old object property by using if necessary
    // the dot notation for the nested keys
    // Checks it the value is an array object
    if (p2.constructor === Array) {
      // Replaces the property name with the value property itself
      value = p2.map(property => objPath.get(obj, property));
    } else if (typeof (p2) === 'string') {
      value = objPath.get(obj, p2);
    }
    // If the property value exists
    if (typeof value !== 'undefined') {
      // If the transformation function exists
      if (p3 && typeof (p3) === 'function') {
        // Prepare the value to be passed as argument
        value = p2 instanceof Array ? value : [value];
        // Checks if there are optional parameters for the function
        // then concatenates the default parameter (the property value) with the optional ones
        const args = p4 ? value.concat(p4) : value;
        // Applies the function
        value = p3.apply(this, args);
      }
      // Sets the value of the new property into the new object structure
      // Uses object-path "set" function for handling nested keys
      objPath.set(acc, p1, value);
      // If the old key is not equal to the new one
      if (preserve && p1 !== p2) {
        // Removes the old keys from the data structure
        if (p2.constructor === Array) {
          p2.forEach(property => objPath.del(initialObj, property));
        } else if (typeof (p2) === 'string') {
          objPath.del(initialObj, p2);
        }
      }
    }
    return acc;
  }, initialObj);
};

module.exports = {
  normalize
};
