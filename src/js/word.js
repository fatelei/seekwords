'use strict';

const wordsList = document.getElementById('word-list');

chrome.storage.local.get(['censorwords'], (rst) => {
  let words = JSON.parse(rst.censorwords || '[]');
  words = words.sort((a, b) => b.length - a.length);
  if (words.length > 0) {
    words.forEach(word => {
      const ele = document.createElement('div');
      ele.classList.add('tag');
      ele.innerText = word;
      wordsList.appendChild(ele);
    });
  } else {
    const noti = document.createElement('div');
    noti.innerText = '还没有词，请先添加';
    wordsList.appendChild(noti);
  }
});
