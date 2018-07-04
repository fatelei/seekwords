'use strict';


function formatCensorWords (words) {
  if (typeof words === 'string') {
    return words.split(',')
  }
}

/**
 * Transform words.
 * @param {Array} words
 * @return {Array}
 */
function transform (words) {
  const container = [];
  for (let word of words) {
    const tmp = word.primary_key.split('|');
    for (let item of tmp) {
      if (!container.includes(item)) {
        container.push(item)
      }
    }
  }
  return container;
}
