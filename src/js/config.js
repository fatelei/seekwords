/*
 * Configuration.
 */
'use strict';

const localRadio = document.getElementById('local');
const remoteRadio = document.getElementById('remote');
const localPanel = document.getElementById('localPanel');
const remotePanel = document.getElementById('remotePanel');
const localSubmitBtn = document.getElementById('localSubmit');
const addBtn = document.getElementById('add');
const syncBtn = document.getElementById('syncBtn');
const loading = document.getElementById('loading');

const callback = (values) => {
    console.log(values)
}


localRadio.addEventListener('click', () => {
    remotePanel.style.display = 'none';
    localPanel.style.display = 'block';
}); 

remoteRadio.addEventListener('click', () => {
    localPanel.style.display = 'none';
    remotePanel.style.display = 'block';
});


localSubmitBtn.addEventListener('click', () => {
    const localWordsEle = document.getElementById('localWords')
    const words = formatCensorWords(localWordsEle.value)
    window.localStorage.setItem('censorwords', JSON.stringify(words))

    alert('添加成功!')
    console.log('dssd')
});

addBtn.addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'form-item';

    const input = document.createElement('input');
    input.setAttribute('placeholder', 'https://example.com');
    input.style = 'width: 400px; height: 30px;';
    input.type = 'url'
    input.pattern = 'https://.*'
    input.size = '20'
    input.required = true

    const button = document.createElement('button');
    button.textContent = '删除';
    button.className = 'danger-btn';
    button.style = 'margin-left: 3px;';
    button.addEventListener('click', () => {
        div.parentNode.removeChild(div);
    });
    div.append(input, button);
    addBtn.parentElement.parentElement.insertBefore(div, addBtn.parentElement.nextSibling);
});


syncBtn.addEventListener('click', () => {
    const items = [];
    const remoteForm = document.getElementById('remoteForm');
    for (let index = 0; index < remoteForm.children.length; index++) {
        const url = remoteForm.children[index].children[0].value;
        if (url) {
            items.push(syncCensorWords(url));
        }
    }

    loading.style.display = 'block';
    Promise.all(items).then(values => {
        callback(values)
        loading.style.display = 'none';
    }).catch(err => {
        loading.style.display = 'none';
        console.log(err)
    });
});
