import { RefObject } from "react";
export default function useListenFocusTriggers({ ref, onFocusByKeyboard, onFocusByMouse }: {
    ref: RefObject<HTMLElement>;
    onFocusByKeyboard?: (event: FocusEvent) => void;
    onFocusByMouse?: (event: FocusEvent) => void;
}): void;
