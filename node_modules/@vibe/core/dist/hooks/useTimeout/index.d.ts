export default function useTimeout({ time, callback, ignoreZeroTime }: {
    callback: () => void;
    time?: number;
    ignoreZeroTime?: boolean;
}): ((...args: any[]) => void)[];
