import { A11yDialogType } from "./ModalHelper";
export default function useAnimationProps(triggerElement: Element, instance: A11yDialogType): (hideAnimation?: boolean) => ({
    transform: string;
    opacity: number;
}[] | {
    duration: number;
    easing: string;
})[];
