'use strict';

let patterns = [];
let currentVersion = 0;
const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
const tpl = '<span class="seekword">{keyword}</span>';
const letters = '0123456789ABCDEF';

function getRandomColor() {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function escapeStringRegexp(str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}
	return str.replace(matchOperatorsRe, '\\$&');
}

function iterNodes(node, patterns) {
  if (node.childNodes.length === 0) {
    if (node.nodeType === 3) { // text node
      if (['seekword', 'keyword'].includes(node.parentNode.className)) {
        return
      }
      let data = node.data;
      const pos = [];
      const longest = [];

      for (let pattern of patterns) {
        if (pattern[0].length > 0) {
          const subStr = longest.filter(item => item.includes(pattern[0]));
          if (subStr.length === 0) {
            let s = data.indexOf(pattern[0]);
            if (s !== -1) {
              e = s + pattern[0].length - 1;
              pos.push([s, e, pattern[0]]);
              longest.push(pattern[0]);
            }
          }
        }
      }

      const tmp = [];
      if (pos.length > 0) {
        for (let i = 0; i <= pos.length - 1; i++) {
          tmp.push(data.slice(0, pos[i][0]));

          let color = getRandomColor();
          tmp.push(`<span class="seekword" style="background-color: ${color}; border-radius: 2px; padding: 2px; color: white;">${pos[i][2]}</span>`);
          if (typeof pos[i+1] === 'undefined') {
            tmp.push(data.slice(pos[i][1] + 1));
          } else {
            tmp.push(data.slice(pos[i][1] + 1, pos[i+1][0]));
          }
        }
      }

      if (pos.length > 0) {
        const span = document.createElement('span');
        span.innerHTML = tmp.join('');

        node.replaceWith(span);
      }
    }
    return
  }

  return node.childNodes.forEach(item => {
    iterNodes(item, patterns);
  })
}

/**
 * Update regex array.
 */
function updateRegexAry (callback) {
  chrome.runtime.sendMessage({ action: 'fetch', key: 'version' }, (resp) => {
    if (resp.version > currentVersion) {
      currentVersion = resp.version;
      chrome.runtime.sendMessage({ action: 'fetch', key: 'censorwords' }, (result) => {
        let words = JSON.parse(result.censorwords || '[]');
        words = words.sort((a, b) => b.length - a.length); 
        
        patterns = [];
        for (let word of words) {
          patterns.push([word, new RegExp(escapeStringRegexp(word), 'gi')])
        }
        console.log('Init regex array successfully');
        callback();
      });
    } else {
      callback();
    }
  });
}


chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    const action = msg.action;
    switch (action) {
      case 'enableHighlight':
        updateRegexAry(() => {
          const contentEle = document.getElementsByClassName('content');
          for (let i = 0; i < contentEle.length; i++) {
            contentEle[i].childNodes.forEach(node => {
              iterNodes(node, patterns)
            });
          }
          const titleEle = document.getElementsByClassName('title');
          for (let i = 0; i < titleEle.length; i++) {
            titleEle[i].childNodes.forEach(node => {
              iterNodes(node, patterns)
            });
          }
          console.log('do highlight');
        });
        port.postMessage({msg: msg});
        break;
      default:
        console.log(`${msg}`);
    }
  });
});


// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName('body')

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList) {
  const contentArea = document.getElementById('navilist');
  if (contentArea) {
    const wantMutation = mutationsList.filter(item => {
      return item.type === 'childList' && item.addedNodes.length > 0 && item.target.id === 'navilist';
    })

    if (wantMutation.length > 0) {
      chrome.runtime.sendMessage({ action: 'fetch', key: 'highlight' }, (rst) => {
        if (rst.highlight) {
          const contentEle = document.getElementsByClassName('content');
          const titleEle = document.getElementsByClassName('title');
          if (contentEle.length > 0 || titleEle.length > 0) {
            updateRegexAry(() => {
              for (let i = 0; i < contentEle.length; i++) {
                contentEle[i].childNodes.forEach(node => {
                  iterNodes(node, patterns)
                });
              }
              for (let i = 0; i < titleEle.length; i++) {
                titleEle[i].childNodes.forEach(node => {
                  iterNodes(node, patterns)
                });
              }
            });
          }
        }
      });
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode[0], config);
