import * as React from 'react';
export interface BullletProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Bulllet: React.FC<BullletProps>;
export default Bulllet;
