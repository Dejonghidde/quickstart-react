export declare const formatNumberConsts: Readonly<{
    MIN_PRECISION: 0;
    MAX_PRECISION: 20;
    DEFAULT_LOCAL: "en-US";
}>;
export declare function formatNumber(value: number, { local, isCompact, precision }?: {
    local?: Intl.Locale["language"];
    isCompact?: boolean;
    precision?: number;
}): string;
