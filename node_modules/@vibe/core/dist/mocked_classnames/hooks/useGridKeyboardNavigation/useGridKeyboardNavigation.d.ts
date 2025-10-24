import { MutableRefObject, ReactElement } from "react";
/**
 * A hook which is used for accessible keyboard navigation. Useful for components rendering a list of items that can be navigated and selected with a keyboard.
 * @param {Object} options
 * @param {React.MutableRefObject} options.ref - the reference for the component that listens to keyboard
 * @param {number} options.itemsCount - the number of items
 * @param {number} options.numberOfItemsInLine - the number of items on each line of the grid
 * @param {function} options.onItemClicked - the callback for selecting an item. It will be called when an active item is selected, for example with "Enter".
 * @param {function} options.getItemByIndex - a function which gets an index as a param, and returns the item on that index
 * @param {boolean=} options.focusOnMount - if true, the referenced element will be focused when mounted
 * @param {number=} options.focusItemIndexOnMount - optional item index to focus when mounted. Only works with "options.focusOnMount".
 * @param {number[]=} options.disabledIndexes - optional array of disabled indices, which will be skipped while navigating.
 * @returns {useGridKeyboardNavigationResult}
 *
 * @typedef useGridKeyboardNavigationResult
 * @property {number} activeIndex - the currently active index
 * @property {boolean} isInitialActiveState - if true, the currently active element was due to an initial mounting index option. See "options.focusItemIndexOnMount".
 * @property {(index: number, isKeyboardAction?: boolean) => void} onSelectionAction - the callback which should be used to select an item.
 * It should be called with the selected item's index. Use this callback for onClick handlers, for example.
 * The "isKeyboardAction" can be used to indicate a keyboard selection, which will affect the currently active index.
 */
export default function useGridKeyboardNavigation({ ref, itemsCount, numberOfItemsInLine, onItemClicked, // the callback to call when an item is selected
getItemByIndex, focusOnMount, focusItemIndexOnMount, disabledIndexes }: {
    ref: MutableRefObject<HTMLElement>;
    itemsCount: number;
    numberOfItemsInLine: number;
    onItemClicked: (element: HTMLElement | ReactElement | void | string, index: number) => void;
    getItemByIndex: (index: number | void) => HTMLElement | ReactElement | void | string;
    focusOnMount?: boolean;
    focusItemIndexOnMount?: number;
    disabledIndexes?: number[];
}): {
    activeIndex: number;
    onSelectionAction: (index: number, isKeyboardAction?: boolean) => void;
    isInitialActiveState: boolean;
};
