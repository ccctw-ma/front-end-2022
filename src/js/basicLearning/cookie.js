
//添加cookie
let addCookie = function (name, value, time) {
    var exp = new Date();
    exp.setTime(exp.getTime() + time);    
    //设置cookie的名称、值、失效时间
    document.cookie = name + "=" + value + ";expires="+ exp.toGMTString();  
}

addCookie('name','msc',1e10)
addCookie('mark','666',1e9)

console.log(document.cookie);