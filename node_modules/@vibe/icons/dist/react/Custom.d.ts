import * as React from 'react';
export interface CustomProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Custom: React.FC<CustomProps>;
export default Custom;
