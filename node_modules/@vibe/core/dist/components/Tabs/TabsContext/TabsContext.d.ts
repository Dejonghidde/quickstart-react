import { FC, ReactElement } from "react";
import VibeComponentProps from "../../../types/VibeComponentProps";
export interface TabsContextProps extends VibeComponentProps {
    activeTabId?: number;
    children?: ReactElement | ReactElement[];
}
declare const TabsContext: FC<TabsContextProps>;
export default TabsContext;
