import React from "react";
import { ListItemProps } from "../../../components/ListItem/ListItem";
import { ListTitleProps } from "../../ListTitle/ListTitle";
import VibeComponentProps from "../../../types/VibeComponentProps";
export interface VirtualizedListItemsProps extends VibeComponentProps {
    children?: React.ReactElement<ListItemProps | ListTitleProps> | React.ReactElement<ListItemProps | ListTitleProps>[];
}
export declare const VirtualizedListItems: React.FC<VirtualizedListItemsProps>;
