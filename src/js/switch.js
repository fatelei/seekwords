// 开关.

'use strict';

const enableBtn = document.getElementById('enable');
const disableBtn = document.getElementById('disable');
const removeBtn = document.getElementById('remove');


function disableHighlight() {
  chrome.storage.local.set({ highlight: false }, () => {
    console.log('disable seekwords');
    enableBtn.classList.remove('active')
    enableBtn.classList.add('active');
  });
}


function enableHighlight() {
  chrome.storage.local.set({ highlight: true }, () => {
    console.log('enable seekwords');
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const port = chrome.tabs.connect(tabs[0].id);
      port.postMessage({ action: 'enableHighlight', value: true });
      port.onMessage.addListener((response) => {
        console.log(response);
      });
    });
    enableBtn.classList.add('active')
    enableBtn.classList.remove('active');
  });
}


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


chrome.storage.local.get(['highlight'], (rst) => {
  if (typeof rst.highlight !== 'undefined') {
    if (rst.highlight) {
      enableBtn.classList.add('active');
    } else {
      disableBtn.classList.add('active');
    }
  }
});
