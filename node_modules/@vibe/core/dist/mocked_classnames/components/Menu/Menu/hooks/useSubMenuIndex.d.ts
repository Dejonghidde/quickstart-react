/// <reference types="react" />
export default function useSubMenuIndex(): {
    setSubMenuIsOpenByIndex: (index: number, isOpen: boolean) => void;
    hasOpenSubMenu: boolean;
    openSubMenuIndex: number;
    setOpenSubMenuIndex: import("react").Dispatch<import("react").SetStateAction<number>>;
    resetOpenSubMenuIndex: () => void;
};
