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
let count = 0

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
    input.setAttribute('placeholder', '词库 ID');
    input.style = "height: 30px;";
    input.type = 'number'
    input.id = `warehouse-${count}`

    const button = document.createElement('button');
    button.textContent = '删除';
    button.className = 'danger-btn';
    button.addEventListener('click', () => {
        div.parentNode.removeChild(div);
    });
    div.append(input, button);
    addBtn.parentElement.parentElement.insertBefore(div, addBtn.parentElement.nextSibling);
});
