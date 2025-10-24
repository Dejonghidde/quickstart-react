import * as React from 'react';
export interface LongTextProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const LongText: React.FC<LongTextProps>;
export default LongText;
