import { RefObject } from "react";
import { GenericEventCallback } from "../../types/events";
declare enum Modifier {
    ALT = "altKey",
    META = "metaKey",
    CTRL = "ctrlKey",
    SHIFT = "shiftKey",
    CTRL_OR_META = "ctrlOrMetaKey"
}
export interface UseKeyEventArgs {
    keys: KeyboardEvent["key"][];
    callback: GenericEventCallback;
    modifier?: Modifier;
    keyEventName?: string;
    withoutAnyModifier?: boolean;
    ref?: RefObject<HTMLElement | Document>;
    ignoreDocumentFallback?: boolean;
    capture?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
}
declare function useKeyEvent({ keys, callback, modifier, withoutAnyModifier, ref, ignoreDocumentFallback, capture, preventDefault, stopPropagation, keyEventName }: UseKeyEventArgs): void;
declare namespace useKeyEvent {
    var modifiers: typeof Modifier;
}
export default useKeyEvent;
