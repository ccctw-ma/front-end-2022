/**
 * @param {number} n
 * @return {number}
 */

//超时

/**
 * 
 *  {let s  = new Set();
    s.add(n)
    let count = 0;
    while(true){
        let temp = new Set()
        count++;
        s.forEach(item=>{
            if(item%2===0){
                temp.add(item>>1);
            }else{
                temp.add(--item)
                temp.add(++item)
            }
        })
        s.add([...temp])
        if(s.has(1)){
            break;
        }
    }
    return count;} n 
 */





var integerReplacement = function (n) {
    let count = 0;
    while (n !== 1) {
        if (n % 2 === 1) {
            let a = countOne(n + 1);
            let b = countOne(n - 1);
            if (a >= b) {
                n -= 1;
            } else {
                n += 1
            }
        } else {
            n >>= 1;
        }
        count++;
    }
    return count;
};


let countOne = function (n) {
    let count = 0;
    while (n) {
        if (n % 2 === 1) {
            count++;
        }
        n = Math.floor(n / 2);
    }
    return count;
}

const memo = new Map();
var integerReplacement = function(n) {
    if (n === 1) {
        return 0;
    }
    if (!memo.has(n)) {
        if (n % 2 === 0) {
            memo.set(n, 1 + integerReplacement(Math.floor(n / 2)));
        } else {
            memo.set(n, 2 + Math.min(integerReplacement(Math.floor(n / 2)), integerReplacement(Math.floor(n / 2) + 1)));
        }
    }
    return memo.get(n);
};


function binaryString(num) {
    //定义变量存放字符串
    var result = '';
    while (true) {
        //取余
        var remiander = num % 2;
        //将余数倒序放入结果中
        result = remiander + result;//+是字符串的拼接
        //求每次除2的商
        num = ~~(num / 2);
        // num= num>>1;
        if (num === 0)
            break;
    }
    return result;
}



console.log(integerReplacement(100000000));
console.log(countOne(15));
console.log(binaryString(100000000));