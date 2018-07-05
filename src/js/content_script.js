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
      let flag = false

      for (let pattern of patterns) {
        if (data.indexOf(pattern[0]) !== -1) {
          let color = getRandomColor()
          data = data.replace(pattern[1], `<span class="seekword" style="background-color: ${color}; border-radius: 2px; padding: 2px; color: white;">${pattern[0]}</span>`);
          flag = true
        }
      }

      if (flag) {
        const span = document.createElement('span');
        span.innerHTML = data;

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
        const words = JSON.parse(result.censorwords || '[]');
        
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
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList) {
  const contentArea = document.getElementById('navilist');
  if (contentArea) {
    chrome.runtime.sendMessage({ action: 'fetch', key: 'highlight' }, (rst) => {
      if (rst.highlight) {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
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
            });
          }
        }
      }
    });
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode[0], config);
