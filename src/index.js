import objPath from 'object-path';

const normalize = (obj, map, preserve = false) => {
  const initialObj = preserve ? Object.assign({}, obj) : {};
  return map.reduce((acc, elem) => {
    let value = objPath.get(obj, elem[1]);
    // If the transform function exists, apply it to the value
    if(elem[2] && typeof(elem[2]) === "function") {
      // Check if there are optional parameters for the transform function
      const args = elem[3] ? [value].concat(elem[3]) : [value];
      value = elem[2].apply(this, args);
    }
    if(value) {
      objPath.set(acc, elem[0], value);
    }
    // If the old key is not equal to the new one
    if(preserve && elem[0] !== elem[1]) {
      // Removes the old key
      objPath.del(initialObj, elem[1]);
    }
    return acc;
  }, initialObj);
};

module.exports = {
  normalize
};
