let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://getman.cn/echo', true);
xhr.onreadystatechange = () => {
    // 通信成功时，状态值为4
    console.log(xhr.readyState);
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // console.log(xhr.responseText);
            // console.log(xhr.response);
            console.log(xhr);
            console.log(xhr.getAllResponseHeaders());
        } else {
            console.error(xhr.statusText);
        }
    }
}
//表示跨域请求时，用户信息（比如 Cookie 和认证的 HTTP 头信息）是否会包含在请求之中
// xhr.withCredentials = true;
xhr.send()

xhr.onloadstart = () => {
    console.log('loadstart');
}
xhr.onprogress = () => {
    console.log('progress');
}
xhr.onload = () => {
    console.log('onload');
}
xhr.onloadend = () => {
    console.log('loadend');
}


let progressBar = document.querySelector('progress');
xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
        progressBar.value = (e.loaded / e.total) * 100;
        // 兼容不支持 <progress> 元素的老式浏览器
        progressBar.textContent = progressBar.value;
    }
};

let i = 1;
setInterval(() => {
    progressBar.value = (i++) % 100;
    // 兼容不支持 <progress> 元素的老式浏览器
    progressBar.textContent = progressBar.value;
}, 100)

//感觉用的不多
// var popup = window.open('http://127.0.0.1:5500/src/html/test02.html', 'title');
// // 父窗口向子窗口发消息
// popup.postMessage('Hello World!', 'http://127.0.0.1:5500/src/html/test02.html');
// window.addEventListener('message', function (e) {
//     console.log(e.data);
// }, false);


var url = 'http://api.alice.com/cors';
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();

