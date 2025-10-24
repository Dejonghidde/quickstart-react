import * as React from 'react';
export interface CutProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Cut: React.FC<CutProps>;
export default Cut;
