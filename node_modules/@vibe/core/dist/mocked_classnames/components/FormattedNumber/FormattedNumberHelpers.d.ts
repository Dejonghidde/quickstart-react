export declare const validateValue: (value: number | string) => boolean;
export declare const customPropTypes: Readonly<{
    range: (min: number, max: number) => (props: Record<string, number>, propName: string, componentName: string) => Error;
}>;
