import { IComboboxCategoryMap, IComboboxOption } from "./components/ComboboxConstants";
type OptionsByCategories = {
    [key: string]: Array<IComboboxOption>;
};
export declare const getOptionsByCategories: (options: IComboboxOption[], categories: IComboboxCategoryMap, filterValue: string) => OptionsByCategories;
export declare const defaultFilter: (filterValue: string, options: IComboboxOption[]) => IComboboxOption[];
export {};
