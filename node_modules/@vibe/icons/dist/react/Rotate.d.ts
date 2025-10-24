import * as React from 'react';
export interface RotateProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Rotate: React.FC<RotateProps>;
export default Rotate;
