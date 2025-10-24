import * as React from 'react';
export interface ShortTextProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const ShortText: React.FC<ShortTextProps>;
export default ShortText;
