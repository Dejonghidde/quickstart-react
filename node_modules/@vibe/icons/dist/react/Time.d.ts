import * as React from 'react';
export interface TimeProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Time: React.FC<TimeProps>;
export default Time;
