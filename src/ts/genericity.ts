/**
 * 泛型
 * @param arg 
 * @returns 
 */
function identity3(arg: number): number {
    return arg;
}
function identity2(arg: any): any {
    return arg;
}
function identity<T>(arg: T): T {
    return arg;
}
let outPut = identity<string>("Hello world!");
console.log(outPut);

function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);
    return arg;
}




// let myIdentity: <T>(arg: T) => T = identity;
interface GenericIdentityFn {
    <T>(arg: T): T;
}
let myIdentity: GenericIdentityFn = identity;

/**
 * genericClass
 */
class GenericNumber<T>{
    zeroValue!: T;
   
    add!: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) { return x + y; };