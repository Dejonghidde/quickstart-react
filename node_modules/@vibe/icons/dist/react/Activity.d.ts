import * as React from 'react';
export interface ActivityProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Activity: React.FC<ActivityProps>;
export default Activity;
