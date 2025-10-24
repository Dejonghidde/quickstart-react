import { NavDirections } from "../useFullKeyboardListeners";
export declare function getActiveIndexFromInboundNavigation({ direction, numberOfItemsInLine, itemsCount }: {
    direction: NavDirections;
    numberOfItemsInLine: number;
    itemsCount: number;
}): number;
export declare function calcActiveIndexAfterArrowNavigation({ activeIndex, itemsCount, numberOfItemsInLine, direction, disabledIndexes }: {
    activeIndex: number;
    itemsCount: number;
    numberOfItemsInLine: number;
    direction: NavDirections;
    disabledIndexes?: number[];
}): {
    isOutbound: boolean;
    nextIndex?: undefined;
} | {
    isOutbound: boolean;
    nextIndex: number;
};
