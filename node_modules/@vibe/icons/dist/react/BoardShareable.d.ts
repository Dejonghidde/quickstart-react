import * as React from 'react';
export interface BoardShareableProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const BoardShareable: React.FC<BoardShareableProps>;
export default BoardShareable;
