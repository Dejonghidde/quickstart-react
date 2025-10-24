import * as React from 'react';
export interface DragProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Drag: React.FC<DragProps>;
export default Drag;
