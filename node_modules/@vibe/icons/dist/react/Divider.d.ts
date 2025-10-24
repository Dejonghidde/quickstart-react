import * as React from 'react';
export interface DividerProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Divider: React.FC<DividerProps>;
export default Divider;
