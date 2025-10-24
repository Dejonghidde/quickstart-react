import * as React from 'react';
export interface DocProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Doc: React.FC<DocProps>;
export default Doc;
