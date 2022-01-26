const only = require("only")



let o = {
    name:"msc",
    age:'22',
    email:'1934202608@qq.com',
    _id:"12345"
}

let user = only(o,['name','age'])


console.log(user);
