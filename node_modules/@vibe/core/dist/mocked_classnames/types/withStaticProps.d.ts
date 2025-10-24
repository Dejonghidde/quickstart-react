import VibeComponent from "./VibeComponent";
import React from "react";
type Required<T> = {
    [P in keyof T]-?: T[P];
};
export declare const withStaticProps: <T, P, S>(forwarded: (VibeComponent<T, P> & Partial<S>) | (React.FC<T> & Partial<S>), staticProps: Required<S>) => ((VibeComponent<T, P> & Partial<S>) | (React.FC<T> & Partial<S>)) & Required<S>;
export {};
