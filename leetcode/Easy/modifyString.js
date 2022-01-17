/**
 * @param {string} s
 * @return {string}
 */
var modifyString = function(s) {
    let arr = s.split('');
    const al = 'abcdefjhijklmnopqrstuvwxyz';
    for(let i=0;i<arr.length;i++){
        if(arr[i]==='?'){
            let pre = i===0 ? '#':arr[i-1];
            let next = i===arr.length-1? '#':arr[i+1];
            for(let j=0;j<al.length;j++){
                if(al[j]!==pre&&al[j]!==next){
                    arr[i] = al[j]
                    break;
                }
            }
        }
    }
    return arr.join('');
};


console.log(modifyString("j?qg??b"))
let codes = Array(26).fill(0).map((t,i) => String.fromCharCode(i + 97))
console.log(codes)
console.log(String.fromCharCode(80))