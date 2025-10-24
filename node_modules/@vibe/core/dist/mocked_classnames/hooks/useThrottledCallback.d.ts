/// <reference types="lodash" />
export default function useThrottledCallback(callback: (...args: Array<unknown>) => void, { wait, trailing }: {
    wait: number;
    trailing: boolean;
}, dependencies: Array<unknown>): import("lodash").DebouncedFunc<(...args: Array<unknown>) => void>;
