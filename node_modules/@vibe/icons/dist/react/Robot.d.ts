import * as React from 'react';
export interface RobotProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Robot: React.FC<RobotProps>;
export default Robot;
