import * as React from 'react';
export interface AttachProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Attach: React.FC<AttachProps>;
export default Attach;
