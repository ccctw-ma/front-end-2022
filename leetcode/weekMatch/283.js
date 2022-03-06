/**
 * @param {string} s
 * @return {string[]}
 */
var cellsInRange = function (s) {
    const arr = s.split(":");
    let c1 = arr[0][0], c2 = arr[1][0];
    let r1 = arr[0][1], r2 = arr[1][1];
    let res = [];
    for (let i = c1.charCodeAt(); i <= c2.charCodeAt(); i++) {
        for (let j = r1.charCodeAt(); j <= r2.charCodeAt(); j++) {
            res.push(String.fromCharCode(i) + String.fromCharCode(j))
        }
    }
    return res;
};

// console.log(cellsInRange("K1:L2"))
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minimalKSum = function (nums, k) {
    // let set = new Set();
    // nums.forEach(n => {
    //     set.add(n);
    // })
    // let res = 0, index = 1;
    // while (k !== 0) {
    //     while (set.has(index)) index++;
    //     res += index;
    //     k--;
    //     index++;
    // }
    // return res;
    nums = [...new Set(nums)].sort((a, b) => a - b);
    let index = 1, i = 0;
    let res = 0;
    while (k !== 0) {
        if (i < nums.length) {
            let n = nums[i] - index;
            let nn = Math.min(n, k);
            let r = index + nn - 1;
            res += (index + r) * nn / 2;
            k -= nn;
            index = nums[i] + 1;
            i++
        } else {
            res += ((index + index + k - 1) * k) / 2;
            k = 0;
        }
    }
    return res;
};
console.log(minimalKSum([1],
    1000000000))


// console.log((1 + 100) * 100 / 2)

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
}

/**
 * @param {number[][]} descriptions
 * @return {TreeNode}
 */
var createBinaryTree = function (descriptions) {
    let bucket = new Array(10001).fill(undefined)
    descriptions.forEach(node => {
        const parent = node[0], child = node[1], isLeft = node[2];
        if (!bucket[parent]) {
            bucket[parent] = {
                node: new TreeNode(parent),
                inGrade: 0
            }
        }
        if (!bucket[child]) {
            bucket[child] = {
                node: new TreeNode(child),
                inGrade: 0,
            }
        }
        if (isLeft) {
            bucket[parent].node.left = bucket[child].node;
        } else {
            bucket[parent].node.right = bucket[child].node;
        }
        bucket[child].inGrade++;
    })
    let root = null;
    for (let i = 1; i <= 10000; i++) {
        if (bucket[i] && bucket[i].inGrade === 0) {
            root = bucket[i].node;
            break;
        }
    }
    return root;
};


/**
 * @param {number[]} nums
 * @return {number[]}
 */



var replaceNonCoprimes = function (nums) {
    function gcd(a, b) {
        let max = Math.max(a, b);
        let min = Math.min(a, b);
        if ((max % min) === 0) {
            return min
        } else {
            return gcd(max % min, min);
        }

    }

    function scm(a, b) {
        return (a * b) / gcd(a, b);
    }

    let res = [];
    for (let i = 0; i < nums.length; i++) {
        let temp = nums[i];
        if (i < nums.length - 1) {
            let next = nums[i + 1];
            if (gcd(temp, next) > 1) {
                nums[i + 1] = scm(temp, next);
            } else {
                res.push(temp);
            }
        } else {
            res.push(temp);
        }
    }
    return res;
};
console.log(replaceNonCoprimes([287, 41, 49, 287, 899, 23, 23, 20677, 5, 825]))

function scm(a, b) {
    return (a * b) / gcd(a, b);
}


function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    const r = a % b;
    return gcd(b, r);
}

console.log(gcd(899, 23))
console.log(scm(899, 20677))