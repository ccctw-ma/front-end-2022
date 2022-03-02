/**
 * @param {number[]} persons
 * @param {number[]} times
 */
var TopVotedCandidate = function (persons, times) {
    let max = 0;
    let v = {}, winner = null;
    this.times = times;
    this.winMap = times.reduce((pre, cur, index) => {
        let p = persons[index];
        v[p] =  (v[p] || 0) + 1;
        let n = v[p];
        // console.log(p,n,max,winner);
        if (n >= max || winner===null) {
            max = n;
            winner = p;
        }
        pre[cur] = winner;
        return pre;
    }, {})
};

/** 
 * @param {number} t
 * @return {number}
 */
TopVotedCandidate.prototype.q = function (t) {
    let l = 0, r = this.times.length - 1;
    while (l < r) {
        let mid = ~~((r + l) / 2);
        if (t < this.times[mid]) {
            r = mid - 1;
        } else if (t > this.times[mid]) {
            l = mid +1;
        } else {
            l = mid;
            break;
        }
    }
    if(this.times[l]>t&&l>0) l--;
    let index = this.times[l];
    // console.log(l,index);
    return this.winMap[index];
};


 // Your TopVotedCandidate object will be instantiated and called as such:
  var obj = new TopVotedCandidate([0,1,0,1,1],[24,29,31,76,81])
  console.log(obj.winMap);
//   var param_1 = obj.q(t)
 console.log(obj.q(25));
//  [[],[45],[49],[59],[68],[42],[37],[99],[26],[78],[43]]

