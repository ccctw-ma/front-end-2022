class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return "(" + this.x + " " + this.y + ")";
    }
}

let point = new Point(1, 2)
console.log(point.hasOwnProperty('x'));
console.log(point.hasOwnProperty('y'));
console.log(point.hasOwnProperty('toString'));
console.log(Object.getPrototypeOf(point).hasOwnProperty('toString'));
