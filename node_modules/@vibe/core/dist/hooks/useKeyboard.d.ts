import { KeyboardEventCallback } from "../types/events";
export declare function useKeyboard({ isDisabled, onKeyDown, onKeyUp }: {
    isDisabled: boolean;
    onKeyDown: KeyboardEventCallback;
    onKeyUp: KeyboardEventCallback;
}): {
    keyboardProps: {
        onKeyDown?: undefined;
        onKeyUp?: undefined;
    } | {
        onKeyDown: (e: UIEvent) => void;
        onKeyUp: (e: UIEvent) => void;
    };
};
