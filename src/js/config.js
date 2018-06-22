/*
 * Configuration.
 */

const localRadio = document.getElementById('local');
const remoteRadio = document.getElementById('remote');
const localPanel = document.getElementById('localPanel');
const remotePanel = document.getElementById('remotePanel');


localRadio.addEventListener('click', () => {
    remotePanel.style.display = 'none';
    localPanel.style.display = 'block';
}); 

remoteRadio.addEventListener('click', () => {
    localPanel.style.display = 'none';
    remotePanel.style.display = 'block';
});
