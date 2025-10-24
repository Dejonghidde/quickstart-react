import * as React from 'react';
export interface BoardPrivateProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const BoardPrivate: React.FC<BoardPrivateProps>;
export default BoardPrivate;
