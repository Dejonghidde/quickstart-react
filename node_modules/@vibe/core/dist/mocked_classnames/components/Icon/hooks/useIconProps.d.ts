import { KeyboardEvent, MouseEvent, UIEvent } from "react";
export default function useIconProps({ onClick, className, clickable, ignoreFocusStyle, isDecorationOnly, iconLabel, externalTabIndex }: {
    onClick?: (event: UIEvent) => void;
    className?: string;
    clickable?: boolean;
    ignoreFocusStyle?: boolean;
    isDecorationOnly?: boolean;
    iconLabel?: string;
    externalTabIndex?: number | undefined;
}): {
    screenReaderAccessProps: {
        "aria-label": string;
        role: string;
        tabIndex: number;
        "aria-hidden": boolean;
    };
    onClickCallback: (event: MouseEvent) => void;
    computedClassName: string;
    onEnterCallback: (event: KeyboardEvent) => void;
    iconRef: import("react").MutableRefObject<any>;
};
