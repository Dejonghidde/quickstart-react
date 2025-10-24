import { FC } from "react";
import { LinkProps } from "../../Link/Link";
export interface AlertBannerLinkProps extends LinkProps {
    marginLeft?: boolean;
}
declare const AlertBannerLink: FC<AlertBannerLinkProps>;
export default AlertBannerLink;
