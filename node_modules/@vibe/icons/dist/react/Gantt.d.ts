import * as React from 'react';
export interface GanttProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Gantt: React.FC<GanttProps>;
export default Gantt;
