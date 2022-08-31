/*
 * @Author: msc
 * @Date: 2022-08-18 23:35:03
 * @LastEditTime: 2022-08-25 00:19:38
 * @LastEditors: msc
 * @Description: 
 */

import { IconTheme, Renderable, ToastPosition, ValueOrFunction } from "react-hot-toast";

type T0 = NonNullable<string | number | undefined | null>;

interface f2 {
    id: string
}
declare function f1(args: {
    a: number;
    b: number
}, person: {
    name: string,
    age: number
}): { a: number, b: number };

type T1 = Parameters<() => string>;
type T2 = Parameters<(s: string) => void>;
type T3 = Parameters<typeof f1>;

const a: T3 = [{ a: 1, b: 2 }, { name: "hello world", age: 12 }];

type T4 = ReturnType<() => string>;
type T5 = ReturnType<() => void>;
type T6 = ReturnType<typeof setTimeout>;
type T7 = ReturnType<typeof f1>;
type T8 = f2['id'];

const map = new Map<string, ReturnType<typeof setTimeout>>();
map.set('id', setTimeout(() => {
    console.log("Hello world");
}, 100))

type ToastType = 'success' | 'error' | 'loading' | 'blank';
const toast: { [key in ToastType]: number } = {
    success: 1,
    error: 2,
    loading: 3,
    blank: 4
}

export interface Toast {
    type: ToastType;
    id: string;
    message: ValueOrFunction<Renderable, Toast>;
    icon?: Renderable;
    duration?: number;
    pauseDuration: number;
    position?: ToastPosition;

    ariaProps: {
        role: 'status' | 'alert';
        'aria-live': 'assertive' | 'off' | 'polite';
    };

    style?: any;
    className?: string;
    iconTheme?: IconTheme;

    createdAt: number;
    visible: boolean;
    height?: number;
}

export type ToastOptions = Partial<
    Pick<
        Toast,
        | 'id'
        | 'icon'
        | 'duration'
        | 'ariaProps'
        | 'className'
        | 'style'
        | 'position'
        | 'iconTheme'
    >
>;

export type DefaultToastOptions = ToastOptions & {
    [key in ToastType]?: ToastOptions;
};

const op: DefaultToastOptions = {
    success: {
        id: '',
        icon: 1
    }
}


const genId = (() => {
    let count = 0;
    return () => {
        return (++count).toString();
    };
})();

console.log(genId());
console.log(genId());
console.log(genId());
console.log(genId());
console.log(genId());


