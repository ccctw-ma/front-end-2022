console.log(document.nodeType);

let test = document.getElementById('test');

let btn = document.getElementById('btn');
console.log(test);
console.log(btn);
btn.addEventListener('click', () => {
    alert('hello world')
})

// setTimeout(() => {
//     btn.dispatchEvent(new Event('click'))
// }, 5000);


let phases = {
    1: 'capture',
    2: 'target',
    3: 'bubble'
};

let testdiv = document.getElementById('testdiv');
let testh1 = document.getElementById('testh1');

function callBack(event) {
    let tag = event.currentTarget.tagName;
    let phase = phases[event.eventPhase];
    console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'");
    console.log(event.composedPath());
}

testdiv.addEventListener('click', callBack, true);
testdiv.addEventListener('click', callBack, false);
testh1.addEventListener('click', callBack, true);
testh1.addEventListener('click', callBack, false);

let mySelect = document.querySelector('#mySelect');
mySelect.addEventListener('input', (e) => {
    console.log(e.target.value)
});


let testInput = document.getElementById('testInput');
testInput.addEventListener('input', (e) => {
    console.log(e.target.value);
})

let touchTest = document.getElementById('touchTest');
window.addEventListener('touchmove', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
        console.log(e.changedTouches[i].identifier);
        console.log(e.changedTouches[i].screenX);
        console.log(e.changedTouches[i].radiusX);
        console.log(e.changedTouches[i].radiusY);
        console.log(e.changedTouches[i].rotationAngle);
    }
})

touchTest.addEventListener('dragstart', (e) => {
    e.target.style.backgroundColor = 'red';
}, false)
touchTest.addEventListener('dragend', (e) => {
    e.target.style.backgroundColor = 'green';
}, false)
touchTest.addEventListener('drag', (e) => {
    e.target.style.backgroundColor = 'black';
}, false)


var dragged;

document.addEventListener('dragstart', function (event) {
    // 保存被拖拉节点
    dragged = event.target;
    // 被拖拉节点的背景色变透明
    event.target.style.opacity = 0.5;
}, false);

document.addEventListener('dragend', function (event) {
    // 被拖拉节点的背景色恢复正常
    event.target.style.opacity = '';
}, false);

document.addEventListener('dragover', function (event) {
    // 防止拖拉效果被重置，允许被拖拉的节点放入目标节点
    event.preventDefault();
}, false);

document.addEventListener('dragenter', function (event) {
    // 目标节点的背景色变紫色
    // 由于该事件会冒泡，所以要过滤节点
    if (event.target.className === 'dropzone') {
        event.target.style.background = 'purple';
    }
}, false);

document.addEventListener('dragleave', function (event) {
    // 目标节点的背景色恢复原样
    if (event.target.className === 'dropzone') {
        event.target.style.background = '';
    }
}, false);

document.addEventListener('drop', function (event) {
    // 防止事件默认行为（比如某些元素节点上可以打开链接），
    event.preventDefault();
    if (event.target.className === 'dropzone') {
        // 恢复目标节点背景色
        event.target.style.background = '';
        // 将被拖拉节点插入目标节点
        dragged.parentNode.removeChild(dragged);
        event.target.appendChild(dragged);
    }
}, false);



var div = document.getElementById('output');

div.addEventListener("dragenter", function (event) {
    div.textContent = '';
    event.stopPropagation();
    event.preventDefault();
}, false);

div.addEventListener("dragover", function (event) {
    event.stopPropagation();
    event.preventDefault();
}, false);

div.addEventListener("drop", function (event) {
    event.stopPropagation();
    event.preventDefault();
    var files = event.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
        div.textContent += files[i].name + ' ' + files[i].size + '字节\n';
    }
}, false);