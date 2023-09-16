## 利用promise实现一个超时请求处理

错误的做法：

```js
let rest=function(){
	let date=Date.now();
	return new Promise((resolve,reject)=>{
		let _date=Date.now();
		if(_date-date>2000){
			reject('请求超时');
		}
		resolve();
	})
}

```

首先，虽然这样很符合直观想法，但是Promise里的构造函数是同步的，也就是说_date和date是相同的`reject`不会执行到。

换个思路：使用`Promise.race`进行抢跑，只要超时的promise先执行，race就会返回第一个结果。

```js
let rest=function(time=1000){
	return Promise.race([
		upload().then(data=>{console.log(data.data)}),
		uploadTimeout(time)
	])
}
function upload(){
	console.log('请求进行中...');
	return new Promise((resolve,reject)=>{
		let xhr=new XMLHttpRequest();
		xhr.open('GET',"https://devapi.qweather.com/v7/weather/24h?location=这里是纬度和经度英文逗号分搁&key=这里是百度地图的key");
		xhr.onload=function(){
			if(xhr.readyState==4 && (xhr.status>=200 && xhr.status<300)){
				setTimeout(()=>{
					resolve({data:JSON.parse(xhr.responseText)})
				},2000)
			}else{
				reject(xhr.status)
			}
		}
		xhr.onerror=function(){
			reject('请求失败了...')
		}
		xhr.send(null);
	})
};
function uploadTimeout(times){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			reject('请求超时，请重试');
		},times)
	})
}
```

