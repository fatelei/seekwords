/*
 * Sync words from remote server.
 */
'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const action = request.action;
  console.log(request);
  switch (action) {
    case 'fetch':
      const key = request.key;
      chrome.storage.local.get([key], (rst) => {
        console.log(rst);
        sendResponse({[key]: rst[key]});
      });
      break
    default:
      console.warn(`unknown action ${action}`);
  }
  return true
});
