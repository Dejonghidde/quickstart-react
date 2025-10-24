import * as React from 'react';
export interface MinimizeProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Minimize: React.FC<MinimizeProps>;
export default Minimize;
