function addScriptTag(src){
    let script = document.createElement('script');
    script.setAttribute('type','text/javascript');
    script.src = src;
    document.body.appendChild(script);
}

window.onload = ()=>{
    addScriptTag('https://getman.cn/echo?callback=foo');
}

function foo(data){
    console.log('Your public IP address is ',data?.ip);
}


