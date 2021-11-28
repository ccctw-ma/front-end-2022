/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var targetIndices = function (nums, target) {
    nums.sort((a, b) => a - b);
    let res = [];
    nums.forEach((val, index) => {
        if (target === val) {
            res.push(index);
        }
    })
    return res;
};


/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var getAverages = function (nums, k) {
    let l = 2 * k + 1;
    if (nums.length < k) return new Array(nums.length).fill(-1);
    let res = [];
    for (let i = 0; i < nums.length; i++) {
        if (i - k < 0 || i + k >= nums.length) {
            res.push(-1);
        } else {
            let sum = 0;
            for (let j = i - k; j <= i + k; j++) {
                sum += nums[j];
            }
            sum = sum / l;
            res.push(~~sum);
        }
    }
    return res;
};


/**
 * @param {number[]} nums
 * @return {number}
 */
var minimumDeletions = function (nums) {
    if (nums.length <= 2) return nums.length;
    //是个知识点
    let min = 1000000,
        max = -1000000;
    let minIndex = 0,
        maxIndex = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] < min) {
            min = nums[i];
            minIndex = i;
        }
        if (nums[i] > max) {
            max = nums[i];
            maxIndex = i;
        }
    }
    if (minIndex > maxIndex) {
        let temp = maxIndex;
        maxIndex = minIndex;
        minIndex = temp;
    }
    let a = minIndex + 1 + nums.length - maxIndex;
    let b = maxIndex + 1;
    let c = nums.length - minIndex;
    return Math.min(a, Math.min(b, c))

};



/**
 * @param {number} n
 * @param {number[][]} meetings
 * @param {number} firstPerson
 * @return {number[]}
 */
var findAllPeople = function (n, meetings, firstPerson) {
    let dsu = new DSU(n);
    dsu.Union(0, firstPerson);
    meetings.sort((a, b) => a[2] - b[2]);

    let i = 0,
        j = 0;
    while (i < meetings.length) {
        while (j < meetings.length && meetings[i][2] === meetings[j][2]) j++;
        for (let k = i; k < j; k++) {
            dsu.Union(meetings[k][0], meetings[k][1]);
        }
        for (let k = i; k < j; k++) {
            if (!dsu.isConnected(meetings[k][0], 0)) {
                dsu.disconnected(meetings[k][0]);
                dsu.disconnected(meetings[k][1]);
            }
        }
        i = j;
    }

    let res = [];
    for (let i = 0; i < n; i++) {
        if (dsu.isConnected(0, i)) {
            res.push(i);
        }
    }
    return res;
};

class DSU {
    constructor(n) {
        this.parent = new Array(n);
        for (let i = 0; i < n; i++) {
            this.parent[i] = i;
        }

        this.find = function (x) {
            while (x != this.parent[x]) {
                this.parent[x] = this.parent[this.parent[x]];
                x = this.parent[x];
            }
            return x;
        };

        this.Union = function (x, y) {
            let px = this.find(x);
            let py = this.find(y);
            if (px < py) {
                this.parent[py] = px;
            } else {
                this.parent[px] = py;
            }
        };

        this.isConnected = function (x, y) {
            return this.find(x) === this.find(y);
        };

        this.disconnected = function (x) {
            this.parent[x] = x;
        };
    }
}

console.log(findAllPeople(4, [
    [3, 1, 3],
    [1, 2, 2],
    [0, 3, 3]
], 3));

// console.log([1,2,3,22,58,5,1000,4,5,6].sort((a,b)=>a-b));


class Node{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

let node = new Node(1,2);
node.x = 2;
console.log(node.x);