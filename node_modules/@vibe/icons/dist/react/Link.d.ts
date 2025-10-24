import * as React from 'react';
export interface LinkProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Link: React.FC<LinkProps>;
export default Link;
