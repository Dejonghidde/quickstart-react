import { ChangeEvent, Dispatch, SetStateAction } from "react";
export type UseDebounceResult = {
    inputValue: string;
    onEventChanged: (event: ChangeEvent<Partial<HTMLInputElement> | Partial<HTMLTextAreaElement>>) => void;
    clearValue: () => void;
    updateValue: Dispatch<SetStateAction<string>>;
};
export default function useDebounceEvent({ delay, onChange, initialStateValue, trim }: {
    onChange: (value: string) => void;
    initialStateValue?: string;
    delay?: number;
    trim?: boolean;
}): {
    inputValue: string;
    onEventChanged: (event: ChangeEvent<Partial<HTMLInputElement> | Partial<HTMLTextAreaElement>>) => void;
    clearValue: () => void;
    updateValue: Dispatch<SetStateAction<string>>;
};
