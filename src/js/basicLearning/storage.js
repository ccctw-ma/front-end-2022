window.localStorage.setItem('foo','a')

window.addEventListener('storage',(e)=>{
    console.log(e);
})

setInterval(()=>{
    window.localStorage.setItem('foo',new Date().toLocaleString());
},2000)