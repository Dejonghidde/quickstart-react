import React from "react";
import VibeComponentProps from "../../types/VibeComponentProps";
export interface ListTitleProps extends VibeComponentProps {
    tabIndex?: number;
    children?: string;
}
declare const ListTitle: React.FC<ListTitleProps>;
export default ListTitle;
