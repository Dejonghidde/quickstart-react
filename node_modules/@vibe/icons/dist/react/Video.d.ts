import * as React from 'react';
export interface VideoProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Video: React.FC<VideoProps>;
export default Video;
