import * as React from 'react';
export interface GifProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Gif: React.FC<GifProps>;
export default Gif;
