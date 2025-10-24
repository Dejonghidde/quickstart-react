/// <reference types="react" />
export declare function useSliderActionsContextValue(actualValue: number | number[], focused: number, getDragging: () => number, getSelectedValue: () => number | number[], max: number, min: number, onChange: (value: number | number[]) => void, ranged: boolean, setActive: (value: number) => void, setFocused: (value: number) => void, setDragging: (value: number) => void, setSelectedValue: (value: number | number[]) => void, step: number): {
    changeThumbValue: (newValue: number | string, thumbIndex?: number, cancelFocus?: boolean) => void;
    decreaseValue: (consumerStep: number) => void;
    drugThumb: (newValue: number | number[]) => void;
    increaseValue: (consumerStep?: number) => void;
    setActive: (value: number) => void;
    setDragging: (value: number) => void;
    setFocused: (value: number) => void;
};
export declare function useDragging(): [number, (value: number) => void, () => number];
export declare function useSliderRail(): {
    railCoords: {
        left: number;
        right: number;
        width: number;
    };
    railRef: import("react").MutableRefObject<any>;
};
export declare function useSliderValues(defaultValue: number | number[], value: number | number[], valueFormatter: (value: number) => string, valueText: string): {
    actualValue: number | number[];
    actualValueText: string | string[];
    getSelectedValue: () => number | number[];
    isControlled: boolean;
    setSelectedValue: (value: number) => void;
};
