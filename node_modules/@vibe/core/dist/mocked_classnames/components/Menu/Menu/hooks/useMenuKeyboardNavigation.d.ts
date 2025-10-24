import React from "react";
export default function useMenuKeyboardNavigation({ hasOpenSubMenu, getNextSelectableIndex, getPreviousSelectableIndex, activeItemIndex, setActiveItemIndex, isVisible, ref, useDocumentEventListeners }: {
    hasOpenSubMenu: boolean;
    getNextSelectableIndex: (index: number) => number;
    getPreviousSelectableIndex: (index: number) => number;
    activeItemIndex: number;
    setActiveItemIndex: (index: number) => void;
    isVisible: boolean;
    ref: React.RefObject<HTMLElement>;
    useDocumentEventListeners: boolean;
}): void;
