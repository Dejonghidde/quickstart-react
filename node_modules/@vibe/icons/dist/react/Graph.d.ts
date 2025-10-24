import * as React from 'react';
export interface GraphProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Graph: React.FC<GraphProps>;
export default Graph;
