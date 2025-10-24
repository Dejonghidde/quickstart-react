import * as React from 'react';
export interface TimelineProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Timeline: React.FC<TimelineProps>;
export default Timeline;
