import * as React from 'react';
export interface BulletsProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Bullets: React.FC<BulletsProps>;
export default Bullets;
