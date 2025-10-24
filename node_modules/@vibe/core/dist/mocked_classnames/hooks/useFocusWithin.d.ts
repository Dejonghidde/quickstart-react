import { FocusEvent } from "react";
type Result = {
    focusWithinProps?: {
        onFocus?: (e: FocusEvent) => void;
        onBlur?: (e: FocusEvent) => void;
    };
};
export declare function useFocusWithin({ onFocusWithin, onFocusWithinChange, isDisabled, onBlurWithin }: {
    onFocusWithin?: (event: FocusEvent) => void;
    onBlurWithin?: (event: FocusEvent) => void;
    onFocusWithinChange?: (isWithinChange: boolean) => void;
    isDisabled?: boolean;
}): Result;
export {};
