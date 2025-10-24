import { MutableRefObject } from "react";
export default function useRefWithCallback(onMount: (element: HTMLElement) => void, onUnmount?: (element: HTMLElement) => void): [MutableRefObject<HTMLElement>, (node: HTMLElement) => void];
