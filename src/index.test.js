import n from '.';

const transformTagsIntoArray = tags => tags.replace(/\s/g, '').split(',');

const takeFirstNHobbies = (hobbies, n) => {
  const _hobbies = hobbies.slice(0, n);
  return _hobbies.length > 1 ? _hobbies : _hobbies.join();
};

const filterWords = (text, words, replacement) => {
  const regex = new RegExp(words.join('|'), 'gi');
  return text.replace(regex, replacement);
};

const getFullAddress = (street, state, postalCode) => `${street}, ${state}, ${postalCode}`;

const map = [
  ['fullName', 'name'],
  ['email', 'info.email'],
  ['fullAddress', ['address.street', 'address.state', 'address.postalCode'], getFullAddress],
  // Converts tags string into an array
  ['tags', 'tags', transformTagsIntoArray],
  // Take the first hobby (Last item of array indicates the optional parameter for che functions)
  ['firstHobby', 'hobbies', takeFirstNHobbies, 1],
  [
    'filteredDescription',
    'description',
    filterWords,
    [
      ['description', 'filtered'],
      '***'
    ]
  ]
];

const obj = {
  name: 'Mario Rossi',
  info: {
    email: 'mariorossi@email.com',
    twitter: '@mariorossitweeter'
  },
  address: {
    street: '803 11th Avenue',
    state: 'California',
    postalCode: '94089'
  },
  tags: 'Javascript, CSS, HTML',
  age: 30,
  description: 'This is a description where some words will be filtered.',
  hobbies: [
    'Golf',
    'Football',
    'Tennis'
  ]
};

const expectedObjWithoutOtherProperties = {
  fullName: 'Mario Rossi',
  email: 'mariorossi@email.com',
  fullAddress: '803 11th Avenue, California, 94089',
  tags: [
    'Javascript',
    'CSS',
    'HTML'
  ],
  filteredDescription: 'This is a *** where some words will be ***.',
  firstHobby: 'Golf'
};

const expectedObjWithOtherProperties = {
  fullName: 'Mario Rossi',
  email: 'mariorossi@email.com',
  info: {
    twitter: '@mariorossitweeter'
  },
  fullAddress: '803 11th Avenue, California, 94089',
  address: {},
  tags: [
    'Javascript',
    'CSS',
    'HTML'
  ],
  age: 30,
  filteredDescription: 'This is a *** where some words will be ***.',
  firstHobby: 'Golf'
};

describe('normalize(object, map, preserve)', () => {
  // Run n.normalize(obj, map)
  test('It should return a normalized obj that doesn\'t preserve the other object properties', () => {
    expect(n.normalize(obj, map)).toEqual(expectedObjWithoutOtherProperties);
  });
  // Run n.normalize(obj, map, true)
  test('It should return a normalized obj that preserves the other object properties', () => {
    expect(n.normalize(obj, map, true)).toEqual(expectedObjWithOtherProperties);
  });
});
