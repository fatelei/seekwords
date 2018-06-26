// 开关.

'use strict';

function disableHighlight() {
    chrome.storage.sync.set({ enableHighlight: false}, function() {
        console.log('highlight is anabled');
    });
}


function enableHighlight() {
    chrome.storage.sync.set({ enableHighlight: true }, function() {
        console.log('highlight is closed');
    });
}


const enableBtn = document.getElementById('enable');
const disableBtn = document.getElementById('disable');

enableBtn.addEventListener('click', () => {
    enableHighlight();
});

disableBtn.addEventListener('click', () => {
    disableHighlight();
});
