import * as React from 'react';
export interface BatteryProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Battery: React.FC<BatteryProps>;
export default Battery;
