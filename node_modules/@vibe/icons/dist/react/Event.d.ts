import * as React from 'react';
export interface EventProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Event: React.FC<EventProps>;
export default Event;
