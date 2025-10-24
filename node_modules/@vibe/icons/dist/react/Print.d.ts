import * as React from 'react';
export interface PrintProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Print: React.FC<PrintProps>;
export default Print;
