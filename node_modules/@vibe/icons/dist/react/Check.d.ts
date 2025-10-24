import * as React from 'react';
export interface CheckProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Check: React.FC<CheckProps>;
export default Check;
