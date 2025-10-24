import * as React from 'react';
export interface FullscreenProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Fullscreen: React.FC<FullscreenProps>;
export default Fullscreen;
