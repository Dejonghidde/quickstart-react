import { MutableRefObject } from "react";
import { KeyboardEventCallback } from "../types/events";
export declare enum NavDirections {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right"
}
export declare const ARROW_DOWN_KEYS: string[];
export declare const ARROW_UP_KEYS: string[];
export declare const ARROW_RIGHT_KEYS: string[];
export declare const ARROW_LEFT_KEYS: string[];
export declare const SELECTION_KEYS: string[];
export declare const ENTER_KEYS: string[];
export declare const ESCAPE_KEYS: string[];
export default function useFullKeyboardListeners({ ref, // the reference for the component that listens to keyboard
onSelectionKey, onArrowNavigation, onEscape, useDocumentEventListeners, focusOnMount }: {
    ref: MutableRefObject<HTMLElement>;
    onSelectionKey: KeyboardEventCallback;
    onArrowNavigation: (type: NavDirections) => void;
    onEscape: KeyboardEventCallback;
    useDocumentEventListeners?: boolean;
    focusOnMount: boolean;
}): void;
