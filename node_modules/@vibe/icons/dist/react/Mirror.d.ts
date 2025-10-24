import * as React from 'react';
export interface MirrorProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Mirror: React.FC<MirrorProps>;
export default Mirror;
