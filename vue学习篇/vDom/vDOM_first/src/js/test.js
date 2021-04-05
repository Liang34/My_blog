document.body.addEventListener('click',()=>{console.log(1)})
document.body.addEventListener('click,',(e)=>{e.preventDefault;console.log(2)}, true)