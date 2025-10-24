import * as React from 'react';
export interface ShredderProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Shredder: React.FC<ShredderProps>;
export default Shredder;
