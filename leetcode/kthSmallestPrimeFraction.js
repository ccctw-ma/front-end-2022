/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 * 
 * 786. 第 K 个最小的素数分数
 */
var kthSmallestPrimeFraction = function (arr, k) {
    let heap = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            let a = arr[i],
                b = arr[j];
            heap.push({
                val: a / b,
                a: a,
                b: b
            });
        }
    }
    heap.sort((a, b) => a.val - b.val);
    // console.log(heap[k-1]);
    return [heap[k - 1].a, heap[k - 1].b];
};

console.log(233)