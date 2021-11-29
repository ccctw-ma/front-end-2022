let btn = document.getElementById('test')
btn.addEventListener('click', () => {
    console.log(window.location);
    // window.location.assign('https//:www.baidu.com')
    // window.location.reload()
    let url = 'https://www.test.com/time=春节'
    console.log(encodeURI(url));
    console.log(encodeURIComponent(url));
    url = new URL('http://user:passwd@www.example.com:4097/path/a.html?x=111#part1');
    console.log(url);
})



// let buffer = new ArrayBuffer(
//     ''
// )
// console.log(buffer.byteLength);


let indexDb = document.getElementById('db');
indexDb.addEventListener('click',())

let request = window.indexedDB.open('test01', 1)
request.onerror = function (event) {
    console.log('数据库打开报错');
};

var db;

request.onsuccess = function (event) {
    db = request.result;
    console.log('数据库打开成功');
    console.log(db);
    console.log(event.target.result);
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    let objectStore;
    if (!db.objectStoreNames.contains('person')) {
        objectStore = db.createObjectStore('person', { keyPath: 'id' });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
    }
}


function add() {
    var request = db.transaction(['person'], 'readwrite')
        .objectStore('person')
        .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });

    request.onsuccess = function (event) {
        console.log('数据写入成功');
    };

    request.onerror = function (event) {
        console.log('数据写入失败');
    }
}

