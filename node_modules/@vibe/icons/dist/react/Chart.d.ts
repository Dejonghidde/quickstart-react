import * as React from 'react';
export interface ChartProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Chart: React.FC<ChartProps>;
export default Chart;
