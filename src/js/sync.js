/*
 * Sync sensitive words.
 */

/**
 * Sync sensitive words
 * @param {function} callback
 */
function syncCensorWords (url, callback) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    // 正确获取到数据.
    if (xhr.status === 200) {
      if (xhr.responseType === 'json') {
        try {
          callback(null, xhr.response)
        } catch (err) {
          console.error(err)
          callback(err, null)
        }
      } 
    }
  }
}
