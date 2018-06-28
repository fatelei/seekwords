'use strict';


function formatCensorWords (words) {
  if (typeof words === 'string') {
    return words.split(',')
  }
}