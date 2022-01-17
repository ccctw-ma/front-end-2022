/**
 * @param {number[]} ages
 * @return {number}
 */
var numFriendRequests = function (ages) {
    ages.sort((a, b) => a - b);
    let count = 0;
    const binarySearch = (arr, fromIndex, toIndex, key) => {
        let low = fromIndex;
        let high = toIndex - 1;
        while (low <= high) {
            let mid = ~~((low + high) >>> 1);
            let midVal = arr[mid];
            if (midVal < key)
                low = mid + 1;
            else if (midVal > key)
                high = mid - 1;
            else
                return mid; // key found
        }
        return -(low + 1);  // key not found.
    }
    for (let i = ages.length - 1; i >= 1; i--) {
        let x = ages[i];
        let y = ~~(x / 2) + 7;
        let index = binarySearch(ages, 0, i, y);
        count += (index >= 0 ? i - index - 1 : i + index + 1)
    }
    return count;
};

console.log(numFriendRequests(ages = [16, 16]))


const binarySearch = (arr, fromIndex, toIndex, key) => {
    let low = fromIndex;
    let high = toIndex - 1;

    while (low <= high) {
        let mid = ~~((low + high) >>> 1);
        let midVal = arr[mid];
        if (midVal < key)
            low = mid + 1;
        else if (midVal > key)
            high = mid - 1;
        else
            return mid; // key found
    }
    return -(low + 1);  // key not found.
}


console.log(binarySearch([1, 2, 3, 4, 5, 6], 0, 6, 4))


