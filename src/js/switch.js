// 开关.

'use strict';

function disableHighlight() {
  window.localStorage.setItem('enableHighlight', false);
}


function enableHighlight() {
  window.localStorage.setItem('enableHighlight', true);

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({ action: 'enableHighlight', value: true });
    port.onMessage.addListener((response) => {
      console.log(response);
    });
  });
  

  // chrome.runtime.sendMessage({ action: 'enableHighlight', value: true }, function (response) {
  //   console.log(response);
  // });
}


const enableBtn = document.getElementById('enable');
const disableBtn = document.getElementById('disable');
const removeBtn = document.getElementById('remove');


enableBtn.addEventListener('click', (e) => {
  e.preventDefault();
  enableHighlight();
});

disableBtn.addEventListener('click', () => {
  disableHighlight();
});

removeBtn.addEventListener('click', () => {
  chrome.storage.local.remove(['censorwords'], () => {
    alert('词库清空成功!');
  });
});
