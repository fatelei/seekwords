/*
 * Sync sensitive words.
 */

/**
 * Sync sensitive words
 * @param {String} url
 */
function syncCensorWords (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = () => {
      // 正确获取到数据.
      if (xhr.status === 200 && xhr.readyState === 4) {
        try {
          const container = transform(JSON.parse(xhr.response));
          resolve(container);
        } catch (err) {
          console.error(err);
          reject(err);
        }
      } else if (xhr.status >= 400) {
        reject(xhr.responseText);
      }
    };
    xhr.send();
  });
};
