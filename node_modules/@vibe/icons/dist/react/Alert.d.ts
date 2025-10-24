import * as React from 'react';
export interface AlertProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Alert: React.FC<AlertProps>;
export default Alert;
