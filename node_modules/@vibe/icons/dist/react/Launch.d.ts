import * as React from 'react';
export interface LaunchProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Launch: React.FC<LaunchProps>;
export default Launch;
