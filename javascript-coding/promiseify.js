// promiseify
const fs = require('fs')
const promiseify = (fn) => {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if(err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }
}

const read = promiseify(fs.readFile)
read('./test.html', 'utf-8').then(res =>console.log(res))