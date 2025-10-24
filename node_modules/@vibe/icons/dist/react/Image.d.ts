import * as React from 'react';
export interface ImageProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Image: React.FC<ImageProps>;
export default Image;
