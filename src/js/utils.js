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
    try {
      const tmp = word.split('|');
      for (let item of tmp) {
        if (tmp.length > 0) {
          if (!container.includes(item)) {
            container.push(item)
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
  return container;
}

/**
 * Update censor words in database.
 * @param {Array} words 
 */
function updateCensorWords (words) {
  chrome.storage.local.get(['censorwords'], (result) => {
    const oldWords = JSON.parse(result.censorwords || '[]');
    for (let word of words) {
      if (!oldWords.includes(word)) {
        oldWords.push(word);
      }
    }
  
    chrome.storage.local.set({'censorwords': JSON.stringify(oldWords)}, () => {
      chrome.storage.local.set({'version': Math.floor((new Date()).getTime() / 1000)}, () => {
        console.log('update censor words successfully');
      });
    });
  });
}
