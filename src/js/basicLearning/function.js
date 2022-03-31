// (function(){console.log('233')}())




//Immediately-Invoked Function Expression
async function test(){
    
   await (async ()=>{
        let a = 3;
        console.log(a);
    })()
}

test()