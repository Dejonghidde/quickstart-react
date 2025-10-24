import React from "react";
type ListContextType = {
    /**
     * A callback function which is being called when the item is being focused by keyboard navigation
     * @param ListItem id
     */
    updateFocusedItem: (id: string) => void;
};
export declare const ListContext: React.Context<ListContextType>;
export {};
