let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.example.com/page.php', true);
xhr.onreadystatechange = () => {
    // 通信成功时，状态值为4
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
        } else {
            console.error(xhr.statusText);
        }
    }
}
xhr.send()