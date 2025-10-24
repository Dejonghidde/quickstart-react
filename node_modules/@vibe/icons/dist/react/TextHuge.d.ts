import * as React from 'react';
export interface TextHugeProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const TextHuge: React.FC<TextHugeProps>;
export default TextHuge;
