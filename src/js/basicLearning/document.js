console.log(document.nodeType);

let test = document.getElementById('test');

let btn = document.getElementById('btn');
console.log(test);
console.log(btn);
btn.addEventListener('click',()=>{
    alert('hello world')
})

// setTimeout(() => {
//     btn.dispatchEvent(new Event('click'))
// }, 5000);


let phases ={
    1:'capture',
    2:'target',
    3:'bubble'
};

let testdiv = document.getElementById('testdiv');
let testh1 = document.getElementById('testh1');

function callBack(event){
    let tag = event.currentTarget.tagName;
    let phase = phases[event.eventPhase];
    console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'");
}

testdiv.addEventListener('click',callBack,true);
testdiv.addEventListener('click',callBack,false);
testh1.addEventListener('click',callBack,true);
testh1.addEventListener('click',callBack,false);