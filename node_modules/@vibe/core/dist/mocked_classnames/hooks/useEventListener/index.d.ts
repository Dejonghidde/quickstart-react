import { RefObject } from "react";
import { GenericEventCallback } from "../../types/events";
export default function useEventListener({ eventName, callback, ref, capture }: {
    eventName: keyof HTMLElementEventMap | string;
    callback: GenericEventCallback;
    ref: RefObject<HTMLElement | Document>;
    capture?: boolean;
}): void;
