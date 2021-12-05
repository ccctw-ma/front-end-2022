/**
 * @param {number[]} digits
 * @return {number[]}
 */
var findEvenNumbers = function (digits) {
    let res = new Set();
    for (let i = 0; i < digits.length; i++) {
        let a = digits[i];
        if (a === 0) continue;
        for (let j = 0; j < digits.length; j++) {
            if (i === j) continue;
            let b = digits[j];
            for (let k = 0; k < digits.length; k++) {
                if (k === i || k === j) continue;
                let c = digits[k];
                if (c % 2 === 0) {
                    res.add(a * 100 + b * 10 + c);
                }
            }
        }
    }
    return [...res].sort((a, b) => a - b);
};

// console.log(findEvenNumbers([2,2,8,8,2]));


/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */

function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}

var deleteMiddle = function (head) {
    let temp = head;
    let count = 0;
    while (temp !== null) {
        count++;
        temp = temp.next;
    }
    if (count === 1) return null;
    let index = ~~(count / 2);
    let pre = null;
    temp = head;
    while (index !== 0) {
        pre = temp;
        temp = temp.next;
        index--;
    }
    pre.next = temp.next;
    return head;
};



/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} startValue
 * @param {number} destValue
 * @return {string}
 */

var getDirections = function (root, startValue, destValue) {
    //找到每个节点的父节点
    let parentMap = new Map();
    let visited = new Set();
    let startNode;
    let res = '';
    let dfs = function (root) {
        if (root === null) return;
        if (root.val === startValue) {
            startNode = root;
        }
        if (root.left !== null) {
            parentMap.set(root.left, root);
            dfs(root.left);
        }
        if (root.right !== null) {
            parentMap.set(root.right, root);
            dfs(root.right);
        }
    };
    let find = function (node, s) {
        if (node === null) return;
        if (node.val === destValue) {
            res = s;
            return;
        }
        if (visited.has(node)) return;
        visited.add(node);
        let p = parentMap.get(node) || null;
        find(p, s + 'U');
        find(node.left, s + 'L');
        find(node.right, s + 'R');
    }
    dfs(root);
    find(startNode, '');
    return res;
};




var getDirections = function (root, startValue, destValue) {
    //找到每个节点的父节点
    let visited = new Set();
    let startNode;
    let res = '';
    let dfs = function (root) {
        if (root === null) return;
        if (root.val === startValue) {
            startNode = root;
        }
        if (root.left !== null) {
            root.left.parent = root;
            dfs(root.left);
        }
        if (root.right !== null) {
           root.right.parent = root;
            dfs(root.right);
        }
    };
    let find = function (node, s) {
        if (node === null) return;
        if (node.val === destValue) {
            res = s;
            return;
        }
        if (visited.has(node)) return;
        visited.add(node);
        let p = node.parent || null;
        find(p, s + 'U');
        find(node.left, s + 'L');
        find(node.right, s + 'R');
    }
    dfs(root);
    find(startNode, '');
    return res;
};
