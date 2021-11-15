// (function(){console.log('233')}())



async function test(){
    
   await (async ()=>{
        let a = 3;
        console.log(a);
    })()
}