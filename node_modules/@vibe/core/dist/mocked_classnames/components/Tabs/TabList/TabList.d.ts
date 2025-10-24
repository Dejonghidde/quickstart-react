import { FC, ReactElement } from "react";
import VibeComponentProps from "../../../types/VibeComponentProps";
import { TabProps } from "../Tab/Tab";
export interface TabListProps extends VibeComponentProps {
    onTabChange?: (tabId: number) => void;
    activeTabId?: number;
    tabType?: string;
    size?: string;
    children?: ReactElement<TabProps>[];
}
declare const TabList: FC<TabListProps>;
export default TabList;
