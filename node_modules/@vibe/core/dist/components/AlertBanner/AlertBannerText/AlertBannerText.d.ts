import { FC } from "react";
import VibeComponentProps from "../../../types/VibeComponentProps";
export interface AlertBannerTextProps extends VibeComponentProps {
    text: string;
    marginLeft?: boolean;
}
declare const AlertBannerText: FC<AlertBannerTextProps>;
export default AlertBannerText;
