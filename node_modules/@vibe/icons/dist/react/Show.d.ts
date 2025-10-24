import * as React from 'react';
export interface ShowProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Show: React.FC<ShowProps>;
export default Show;
