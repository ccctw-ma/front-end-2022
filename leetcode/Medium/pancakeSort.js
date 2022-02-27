/**
 * @param {number[]} arr
 * @return {number[]}
 */
const pancakeSort = (arr) => {

    const check = arr => {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] >= arr[i + 1]) {
                return false;
            }
        }
        return true;
    }
    const swap = (arr, index) => {
        let l = 0, r = index - 1;
        while (l < r) {
            let temp = arr[l];
            arr[l] = arr[r];
            arr[r] = temp;
            l++;
            r--;
        }
    }
    const findMax = (arr, len) => {
        let max = arr[0], index = 0;
        for (let i = 1; i < len; i++) {
            if (arr[i] > max) {
                max = arr[i];
                index = i;
            }
        }
        return index;
    }
    let res = [], len = arr.length;
    while (!check(arr)) {
        let index = findMax(arr, len);
        swap(arr, index + 1);
        swap(arr, len);
        res.push(index + 1);
        res.push(len);
        len--;
    }
    return res;
};

console.log(pancakeSort([3, 2, 4, 1]))