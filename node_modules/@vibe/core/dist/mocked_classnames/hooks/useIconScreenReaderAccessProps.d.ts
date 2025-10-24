export default function useIconScreenReaderAccessProps({ isClickable, label, isDecorationOnly }: {
    isClickable: boolean;
    label: string;
    isDecorationOnly: boolean;
}): {
    "aria-label": string;
    role: string;
    tabIndex: number;
    "aria-hidden": boolean;
};
