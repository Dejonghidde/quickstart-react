import * as React from 'react';
export interface UndoProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Undo: React.FC<UndoProps>;
export default Undo;
