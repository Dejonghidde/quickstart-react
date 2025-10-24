import * as React from 'react';
export interface TextProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Text: React.FC<TextProps>;
export default Text;
