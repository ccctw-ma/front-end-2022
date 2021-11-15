var arr = ['a', 'b', 'c'];
console.log(Object.keys(arr));


arr[3] = 1
console.log(arr.length);
arr[10] = 1
console.log(arr.length);
arr[100] = 1
console.log(arr.length);
arr[10000] = 1
console.log(arr.length);
console.log(arr[1201]);
arr[-1] = 'a'
console.log(arr[-1]);

function args(){
    return arguments
}

let arrlike = args('a','b')
console.log(arrlike instanceof Array);
console.log(arrlike);
console.log(Array.prototype.slice.call(arrlike));


let arr1 = [1,2,3,[1,2,3]]
console.log(arr1.valueOf());
console.log(arr1.toString());


let arr2 = ['a','b','c']
console.log(arr2.shift());
console.log(arr2.unshift('x'));
console.log(arr2);

let arr3 = [1,2,3,4]
console.log(arr3.join(' '));
console.log(arr3.join(' | '));
console.log(arr3.join('-'));
console.log(arr3.join(''));
//如果数组成员是undefined或null或空位，会被转成空字符串。
console.log([undefined,null].join('#'));
console.log(['a',, 'b'].join('-'));
console.log(Array.prototype.join.call('hello',':'));

console.log([1,2,3].concat([4,5,6]));

console.log(Array.prototype.slice.call({0:1,1:2,length:2}));

console.log([1,2,3,4,5].slice());

console.log([1,2,3,4,5,6].splice(3,2));

let arr4 = [1,2,3,4,5,6]
arr4.splice(3,2,1,2,3)
console.log(arr4);

console.log([10111,1101,111].sort((a,b)=>Number(a)-Number(b)));

console.log([1,2,3,4].map(item=>item**3));

//上面代码中，map()方法不会跳过undefined和null，但是会跳过空位。
console.log([1,2,3,4].map((item,index,arr)=>{
    return arr[index]===item
}));


console.log([0,1,'a',false].filter(Boolean));

console.log([1,2,3].some(item=>item>2));
console.log([1,2,3].every(item=>item>2));
console.log([1,2,3,4,5].reduce((a,b)=>a+b,10));

console.log(['aa','a','aaa'].reduce((a,b)=>b.length>a.length?b:a));

console.log([1,2,3,4,5].indexOf(2));