import * as React from 'react';
export interface LinesProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Lines: React.FC<LinesProps>;
export default Lines;
