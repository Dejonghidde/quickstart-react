import * as React from 'react';
export interface PinProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Pin: React.FC<PinProps>;
export default Pin;
