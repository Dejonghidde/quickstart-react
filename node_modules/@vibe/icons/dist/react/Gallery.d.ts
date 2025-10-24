import * as React from 'react';
export interface GalleryProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Gallery: React.FC<GalleryProps>;
export default Gallery;
