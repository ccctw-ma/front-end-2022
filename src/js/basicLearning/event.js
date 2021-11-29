let preX;
let preY;
let preT;
let timer
// window.addEventListener('mousemove', function (event) {
//     if(timer){
//         return;
//     }
//     timer = this.setTimeout(()=>{
//         if (preX !== undefined) {
//             let deltaX = event.screenX - preX;
//             let deltaY = event.screenY - preY;
//             let deltaD = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
//             let deltaT = event.timeStamp - preT;
//             console.log(deltaD / deltaT * 1000);
//         }
//         preX = event.screenX;
//         preY = event.screenY;
//         preT = event.timeStamp;
//         timer = null;
//     },500)
// })

window.addEventListener('click',(MouseEvent)=>{
    console.log(MouseEvent.detail);
})


let input = document.getElementById('myInput');
input.addEventListener('keypress',(KeyboardEvent)=>{
    if(KeyboardEvent.charCode<97||KeyboardEvent.charCode>122){
        KeyboardEvent.preventDefault();
    }
},false);

window.addEventListener('contextmenu',(e)=>{
    e.preventDefault();
    alert("我点击了右键")
},false)