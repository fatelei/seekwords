'use strict';

/**
 * Format local words.
 * @param {String} words 
 */
function formatCensorWords (words) {
  if (typeof words === 'string') {
    return words.split(',')
  }
  return []
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
