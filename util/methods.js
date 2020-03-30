const fetch = require("node-fetch");
const {Readable} =require('stream')
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
exports.writeStream = (data,res)=>{
  let inputStream = new Readable({
    read(){}
  })
  for(let item = 0; item < data.length ; item++){
    if(item === (data.length - 1)){
      inputStream.push(`${JSON.stringify(data[item])}`)
    }
    else{
      inputStream.push(`${JSON.stringify(data[item])}/`)
    }
    
  }
  inputStream.push(null)
  inputStream.pipe(res)
}
