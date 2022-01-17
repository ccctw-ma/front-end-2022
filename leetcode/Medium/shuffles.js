var Solution = function(nums) {
    this.nums = nums;
    this.original = nums.slice();

};

Solution.prototype.reset = function() {
    this.nums = this.original.slice();
    return this.nums;
};

Solution.prototype.shuffle = function() {
    const shuffled = new Array(this.nums.length).fill(0);
    const list = [];
    this.nums.forEach((num) => list.push(num));
    for (let i = 0; i < this.nums.length; ++i) {
        const j = Math.random() * list.length;
        shuffled[i] = list.splice(j, 1);
    }
    this.nums = shuffled.slice();
    return this.nums;
};

let arr = [1,2,3,4,5]
// arr.slice(1,3);
// console.log(arr.splice(1,2));
let index = Math.random()*5;
console.log(~~index);
console.log(arr.splice(index,1))
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')