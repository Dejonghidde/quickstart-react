import * as React from 'react';
export interface BugProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Bug: React.FC<BugProps>;
export default Bug;
