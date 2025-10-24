import * as React from 'react';
export interface NumbersProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Numbers: React.FC<NumbersProps>;
export default Numbers;
