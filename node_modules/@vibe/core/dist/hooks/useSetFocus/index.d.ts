import { RefObject } from "react";
export default function useSetFocus({ ref, focusCallback, blurCallback }: {
    ref: RefObject<HTMLElement>;
    focusCallback?: () => void;
    blurCallback?: () => void;
}): {
    isFocused: boolean;
    focus: () => void;
    blur: () => void;
};
