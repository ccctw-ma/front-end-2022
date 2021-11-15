"use strict";
function* gen() {
    yield 1;
    return 2;
}
let g = gen();
console.log(g.next().value, g.next().value);
