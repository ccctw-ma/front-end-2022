

// setTimeout(()=>console.log(2),1000)

setTimeout((a, b) => console.log(a + b), 1000, 1, 1)



// setInterval(function () {
//     console.log(2);
// }, 1000);

// sleep(3000);

// function sleep(ms) {
//     var start = Date.now();
//     while ((Date.now() - start) < ms) {
//     }
// }


let div = document.getElementById('test');
var timer;
var i=0x100000;


console.log(div);
// function func() {
//   timer = setTimeout(func, 100);
//   div.style.backgroundColor = '#' + i.toString(16);
//   if (i++ == 0xFFFFFF) clearTimeout(timer);
// }

// timer = setTimeout(func, 1000);