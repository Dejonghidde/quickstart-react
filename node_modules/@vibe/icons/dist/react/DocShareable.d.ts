import * as React from 'react';
export interface DocShareableProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const DocShareable: React.FC<DocShareableProps>;
export default DocShareable;
