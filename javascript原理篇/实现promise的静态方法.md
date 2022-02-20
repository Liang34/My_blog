`Promiser.all`

```js
static all(list){
    return new MyPromise(function (resolve, reject) {
        let arr = [];
        let count = 0;
        for(let i = 0; i < list.length; i++){
            let p = list[i];
            p.then(function (value) {
                arr.push(value);
                count++;
                if(list.length === count){
                    resolve(arr);
                }
            }).catch(function (e) {
                reject(e);
            });
        }
    });
}
```

`Promise.race`

```js
static race(list){
    return new MyPromise(function (resolve, reject) {
        for(let p of list){
            p.then(function (value) {
                resolve(value);
            }).catch(function (e) {
                reject(e);
            });
        }
    })
}
```



