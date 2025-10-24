import * as React from 'react';
export interface SunProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Sun: React.FC<SunProps>;
export default Sun;
