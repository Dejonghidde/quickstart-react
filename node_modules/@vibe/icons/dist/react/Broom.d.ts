import * as React from 'react';
export interface BroomProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Broom: React.FC<BroomProps>;
export default Broom;
