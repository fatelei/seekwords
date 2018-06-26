/*
 * Sync words from remote server.
 */
'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
});


chrome.runtime.onMessage.addListener(function (message, callback) {
  const action = message.action
  switch (action) {
    case 'local':
      // Update local storage.
      break
    case 'remote':
      // Sync words via remote api.
      break
    default:
      console.warn(`unsupport action ${action}`)
  }
});
