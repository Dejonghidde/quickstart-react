import * as React from 'react';
export interface WandProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Wand: React.FC<WandProps>;
export default Wand;
