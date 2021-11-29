/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node|null} root
 * @return {number}
 */
var maxDepth = function (root) {
    if (root == null) return 0;
    let max = 0;
    root.children.forEach(node => max = Math.max(max, maxDepth(node)))
    return 1 + max;
};


let arr = [1,2,3,4]
arr.splice(1,2,5,6)
let arrid ='app_djshfkashdfklhadskjhfads12312'
arrid = arrid.split('_')
arrid.splice(1,0,'dev')
console.log(arrid.join('_'))

console.log(navigator.userAgent)