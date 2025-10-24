import * as React from 'react';
export interface GlobeProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Globe: React.FC<GlobeProps>;
export default Globe;
