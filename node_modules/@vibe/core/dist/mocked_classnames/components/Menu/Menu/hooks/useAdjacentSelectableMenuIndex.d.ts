import { ReactElement } from "react";
export declare const useAdjacentSelectableMenuIndex: ({ children }: {
    children: ReactElement[];
}) => {
    getNextSelectableIndex: (currentActiveItemIndex: number) => number;
    getPreviousSelectableIndex: (currentActiveItemIndex: number) => number;
};
