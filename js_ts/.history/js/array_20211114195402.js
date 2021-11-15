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

let arr