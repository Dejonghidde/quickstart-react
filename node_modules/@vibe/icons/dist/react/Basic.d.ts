import * as React from 'react';
export interface BasicProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Basic: React.FC<BasicProps>;
export default Basic;
