import * as React from 'react';
export interface EraseProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Erase: React.FC<EraseProps>;
export default Erase;
