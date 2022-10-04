(() => {
    let n = 42;
    let m = new Number(42);
    // m.toFixed(12));
    let temp = new Number(n);
    let res = temp.toFixed(12);
    console.log(res);
    // delete temp

    const f = (a: number, b: number) => a + b;
    f.data = 1;
    console.log(f(1, 2));
    // 索引签名
    type A = {
        [k: symbol]: number,
    }

    type A2 = Record<string, number>

    let s = Symbol();
    let a: A = {
        [s]: 1
    }
    console.log(a[s]);

    type Tuple = [number, number, string]
    let tuple: Tuple = [1, 2, 's'];
    console.log(tuple);

    type AA = [1, 2, 3];
    let aa: AA = [1, 2, 3];


    // function
    type FnA = (a: number, c: number) => number
    let fa: FnA = (a, b) => a + b

    type O = object
    const o: O = new Number(1);

    const wm: WeakMap<{ name: string }, string> = new WeakMap();
    wm.set({ name: '1' }, 's')
    console.log(wm);

    let un: unknown = [1, 2];
    console.log((un as number[]).length);

    type Rect = {
        height: number
        width: number
    }
    type Circle = {
        center: [number, number]
        radius: number
    }

    const f1 = (a: Rect | Circle) => {
        if (isRect(a)) {
            a
        } else {
            a
        }
    }

    function isRect(x: Rect | Circle): x is Rect {
        return 'height' in x && 'width' in x
    }

    type Person = {
        name: string
        age: number
        id: string
    }

    type User = Person & {
        id: number
        email: string
    }

    type typeOfUser = keyof User

    type AAA = {
        name: string
    }
    type BBB = {
        age: number
    }

    type CCC = AAA | BBB


    type MyPick<T, K extends keyof T> = {
        [P in K]: T[P]
    }

    type R = MyPick<{ a: 1, b: 2, c: 3 }, "a" | "b">;

    type Zip<A extends any[], B extends any[]> =
        A extends [infer AFirst, ...infer ARest]
        ? B extends [infer BFirst, ...infer BRest]
        ? [[AFirst, BFirst], ...Zip<ARest, BRest>]
        : []
        : []



    type exp = Zip<[1, 2], [true, false]>

    type isNever<T> = [T] extends [never] ? true : false



    type SquareEvent = { kind: "square", x: number, y: number };
    type CircleEvent = { kind: "circle", radius: number };
    type Config = SquareEvent | CircleEvent
    const tupleMix = [1, '2', 3, '4'] as const
    type tupleMix = {
         [k in typeof tupleMix[number]]? : k
    }

})();