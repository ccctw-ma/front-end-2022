const test = (D, x) => {
    let l = 0, r = 0;
    let res = 0;
    while (l < D.length) {
        let min = D[l], max = D[l];
        while (r < D.length) {
            min = Math.min(min, D[r]);
            max = Math.max(max, D[r]);
            if ((max - min) <= x) {
                r++;
            }else {
                break;
            }
        }
        res++;
        l = r ;
    }
    return res;
}

console.log(test([2,5,9,2,1,4],4));
console.log(test([1,12,10,4,5,2],2));