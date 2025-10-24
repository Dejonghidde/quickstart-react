declare const useDisableScroll: (scrollableQuerySelector: string) => {
    disableScroll: () => void;
    enableScroll: () => void;
};
export default useDisableScroll;
