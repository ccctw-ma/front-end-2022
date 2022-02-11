// 进行引用
const dayjs = require('dayjs')

// 引用的dayjs实例是一个函数返回的实例，可以直接使用。
// 获取到当前时间，格式化（年-月-日 时-分-秒）

// 初始化其他时间,格式化（年-月-日 时-分-秒）
let date = new Date();
let currDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
let a = dayjs(date)
console.log(a.valueOf())
console.log(a.format('YYYY年MM月DD日'))
console.log(a.format('MM月-DD日'))
console.log(dayjs(a.format('YYYY-MM-DD')).toDate())


console.log(dayjs('2022-1-5').diff(dayjs('2022-1-4'), 'day') + 1)

data = {
    title: "杠铃后蹲-箱式",
    frequency: '1',
    rest: '1',
    representative: '1',
    load: '2',
    trainTarget: '力量',
    rhythmE: '1',
    rhythmP: '2',
    rhythmC: '3',
    remarks: '多读书、多看报、少吃零食多睡觉',
    useElasticBand: true
}

// let arr = [1, 2, 3, 4, 5]
// console.log(arr.splice(3))
// console.log(arr)


let material = {
    "strength": [
        {
            "_id": "v001",
            "name": "杠铃后蹲-箱式",
            "coverSrc": "/app-material-video/cover/13179540-3cf8-4e80-8436-e2b7be04a80d.jpeg",
            "videoSrc": "/app-material-video/resourceType/c744da69-4b42-4402-a1dd-f54d5d8652f1.mp4",
            "content": "这里是文字说明",
            "type": "strength"
        },
        {
            "_id": "v002",
            "name": "杠铃后蹲-22",
            "coverSrc": "/app-material-video/cover/13179540-3cf8-4e80-8436-e2b7be04a80d.jpeg",
            "videoSrc": "/app-material-video/resourceType/c744da69-4b42-4402-a1dd-f54d5d8652f1.mp4",
            "content": "这里是文字说明",
            "type": "strength"
        }
    ]
}


// Object.keys(material).forEach(key=>{
//     console.log(material[key])
// })

Object.entries(material).forEach(e=>{
    console.log(e)
})

let arr =[1,2,3]
arr.push(...[4,5,6])
console.log(arr)
console.log(arr.map(e=> {
    if(e>=3) return e
}))

let o = {
    id:'123',
    title: '334'
}

let c = {
    
    ...o,
    ...{
        id:'456',
        name:'szh',
        age:23
    },
}
console.log(c)


let aa = [0]
console.log(!!aa)
if(aa){
    console.log(aa==true)
}else {
    console.log(aa)
}



let error = ['hello world',"大周期余量不足","小周期浴帘公布"]
console.log(error.join(' / '));

