import React from "react";
import { CloseMenuOption } from "../MenuConstants";
export default function useCloseMenuOnKeyEvent({ hasOpenSubMenu, onCloseMenu, ref, onClose, isSubMenu, useDocumentEventListeners }: {
    hasOpenSubMenu: boolean;
    onCloseMenu: (option: CloseMenuOption) => void;
    ref: React.RefObject<HTMLElement>;
    onClose: (option: CloseMenuOption, key?: string) => void;
    isSubMenu: boolean;
    useDocumentEventListeners: boolean;
}): void;
