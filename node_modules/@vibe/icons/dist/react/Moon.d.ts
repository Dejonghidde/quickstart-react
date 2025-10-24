import * as React from 'react';
export interface MoonProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Moon: React.FC<MoonProps>;
export default Moon;
