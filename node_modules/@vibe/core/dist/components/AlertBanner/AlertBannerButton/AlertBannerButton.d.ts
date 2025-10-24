import { ButtonProps } from "../../Button/Button";
import { FC } from "react";
export interface AlertBannerButtonProps extends ButtonProps {
    isDarkBackground?: boolean;
}
declare const AlertBannerButton: FC<AlertBannerButtonProps>;
export default AlertBannerButton;
