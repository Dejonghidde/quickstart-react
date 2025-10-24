import * as React from 'react';
export interface BoardProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Board: React.FC<BoardProps>;
export default Board;
