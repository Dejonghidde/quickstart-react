import { MutableRefObject } from "react";
export declare function chainRefFunctions(funcsOrRefs: Array<MutableRefObject<HTMLElement> | ((element: HTMLElement) => void | boolean)>, allowBreak?: boolean): (args: HTMLElement) => void;
export declare function chainFunctions(funcs: Array<(args: any) => void | boolean>, allowBreak?: boolean): (args: any) => void;
export declare function convertToArray<T>(input: T | Array<T>): Array<T>;
export declare function NOOP(): void;
