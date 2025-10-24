import { ReactElement } from "react";
export interface UseFocusOnMountProps {
    focusItemIndexOnMount: number;
    focusChildOnMount: ReactElement;
    getNextSelectableIndex: (index: number) => number | null;
    updateActiveItemIndex: (index: number) => void;
    setIsInitialFocusSet: (state: boolean) => void;
}
export declare const useFocusOnMount: ({ focusItemIndexOnMount, focusChildOnMount, getNextSelectableIndex, updateActiveItemIndex, setIsInitialFocusSet }: UseFocusOnMountProps) => void;
