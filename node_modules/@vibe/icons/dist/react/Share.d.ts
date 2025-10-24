import * as React from 'react';
export interface ShareProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Share: React.FC<ShareProps>;
export default Share;
