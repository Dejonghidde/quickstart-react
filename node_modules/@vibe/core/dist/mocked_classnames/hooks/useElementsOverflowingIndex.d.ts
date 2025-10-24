import { ReactNode, RefObject } from "react";
declare function useElementsOverflowingIndex({ ref, children, paddingSize, resizeDebounceTime, ignoreLast }: {
    ref: RefObject<HTMLElement>;
    children: ReactNode;
    paddingSize: number;
    resizeDebounceTime: number;
    ignoreLast: boolean;
}): number;
export default useElementsOverflowingIndex;
