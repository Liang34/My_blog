const express = require('./jh-express/index'); // createApplication方法
const app = express(); // 执行createApplication方法, 会返回一个对象给我们
app.get('/', (req, res)=>{
    res.end('helloWorld');
});
app.get('/test', (req, res)=>{
    res.end('/test');
});

app.listen(3000, ()=>{
    console.log('listen 3000 ok');
});