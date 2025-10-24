import React, { MutableRefObject } from "react";
import { UseKeyEventArgs } from "../useKeyEvent";
export declare function useSupportArrowsKeyboardNavigation({ itemsCount, focusedElementRef, visualFocusItemIndex, setVisualFocusItemIndex, isHorizontalList, isItemSelectable, listenerOptions, triggeredByKeyboard }: {
    itemsCount: number;
    focusedElementRef: MutableRefObject<HTMLElement>;
    visualFocusItemIndex: number;
    setVisualFocusItemIndex: (index: number) => void;
    isHorizontalList: boolean;
    isItemSelectable: (index: number) => boolean;
    triggeredByKeyboard: MutableRefObject<boolean>;
    listenerOptions: Omit<UseKeyEventArgs, "keys" | "callback">;
}): void;
export declare function useSupportPressItemKeyboardNavigation({ visualFocusItemIndex, focusedElementRef, itemsCount, setVisualFocusItemIndex, onItemClick, isItemSelectable, listenerOptions, isIgnoreSpaceAsItemSelection }: {
    visualFocusItemIndex: number;
    focusedElementRef: MutableRefObject<HTMLElement>;
    itemsCount: number;
    setVisualFocusItemIndex: (index: number) => void;
    onItemClick: (event: React.MouseEvent | React.KeyboardEvent, index: number) => void;
    isItemSelectable: (index: number) => boolean;
    listenerOptions: Omit<UseKeyEventArgs, "keys" | "callback">;
    isIgnoreSpaceAsItemSelection: boolean;
}): void;
export declare function useCleanVisualFocusOnBlur({ focusedElementRef, visualFocusItemIndex, setVisualFocusItemIndex }: {
    focusedElementRef: MutableRefObject<HTMLElement>;
    visualFocusItemIndex: number;
    setVisualFocusItemIndex: (index: number) => void;
}): void;
export declare function useSetDefaultItemOnFocusEvent({ focusedElementRef, isItemSelectable, visualFocusItemIndex, setVisualFocusItemIndex, itemsCount, defaultVisualFocusItemIndex }: {
    focusedElementRef: MutableRefObject<HTMLElement>;
    isItemSelectable: (index: number) => boolean;
    visualFocusItemIndex: number;
    setVisualFocusItemIndex: (index: number) => void;
    itemsCount: number;
    defaultVisualFocusItemIndex: number;
}): {
    triggeredByKeyboard: React.MutableRefObject<boolean>;
};
export declare function useKeepFocusOnItemWhenListChanged({ visualFocusItemIndex, itemsIds, isItemSelectable, setVisualFocusItemIndex }: {
    visualFocusItemIndex: number;
    itemsIds: string[];
    isItemSelectable: (index: number) => boolean;
    setVisualFocusItemIndex: (index: number) => void;
}): void;
