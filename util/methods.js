const fetch = require("node-fetch");
const { baseurl } = require("../config");
exports.callItemsApi = page => {
console.log(page)
  return new Promise((resolve, reject) => {
    fetch(`${baseurl}?page=${page}`)
      .then(response => response.json())
      .then(fetchedItems => {
        resolve({ page: page, data: fetchedItems.data?fetchedItems.data:[] });
      })
      .catch(error => {
        reject(error);
      });
  });
};
