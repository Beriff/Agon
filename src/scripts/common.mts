export type Func = (...args: any) => any;
/**
 * A function that returns an instance of type `T`
 */
export type Generator<T> = (...args: any) => T;

export namespace AgonMath {
    export type Interpolator<T> = (start: T, end: T, t: number) => T;

    export const Lerp: Interpolator<number> = (a: number, b: number, t: number) => a + (b - a) * t;
}