import * as React from 'react';
export interface StatusProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Status: React.FC<StatusProps>;
export default Status;
