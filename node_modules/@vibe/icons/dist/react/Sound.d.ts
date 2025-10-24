import * as React from 'react';
export interface SoundProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Sound: React.FC<SoundProps>;
export default Sound;
