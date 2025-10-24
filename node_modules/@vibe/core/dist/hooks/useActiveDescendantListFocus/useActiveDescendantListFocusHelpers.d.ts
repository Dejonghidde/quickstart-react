type ActiveDependentHelper = {
    isItemSelectable: (index: number) => boolean;
    visualFocusItemIndex: number;
    itemsCount: number;
};
export declare function getNextSelectableIndex({ isItemSelectable, visualFocusItemIndex, itemsCount }: ActiveDependentHelper): number;
export declare function getPreviousSelectableIndex({ isItemSelectable, visualFocusItemIndex, itemsCount }: ActiveDependentHelper): number;
export {};
