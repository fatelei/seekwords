let patterns = [];
const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
const tpl = '<span class="keyword">{keyword}</span>';

function escapeStringRegexp(str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}
	return str.replace(matchOperatorsRe, '\\$&');
}

function iterNodes(node, patterns) {
  if (node.childNodes.length === 0) {
    if (node.nodeType === 3) { // text node
      let data = node.data;

      for (let pattern of patterns) {
        if (data.indexOf(pattern[0]) !== -1) {
          data = data.replace(pattern[1], `<span class="keyword">${pattern[0]}</span>`);
        }
      }
      const span = document.createElement('span');
      span.innerHTML = data;

      node.replaceWith(span);
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
  chrome.storage.local.get(['censorwords'], (result) => {
    const words = JSON.parse(result.censorwords || '[]');

    patterns = [];
    for (let word of words) {
      patterns.push([word, new RegExp(escapeStringRegexp(word), 'gi')])
    }
    console.log('Init regex array successfully');
    callback();
  });
}


chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    const action = msg.action;
    switch (action) {
      case 'enableHighlight':
        if (patterns.length === 0) {
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
        }
        port.postMessage({msg: msg});
        break;
      default:
        console.log(`${msg}`);
    }
  });
});
