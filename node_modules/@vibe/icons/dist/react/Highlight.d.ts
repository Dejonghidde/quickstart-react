import * as React from 'react';
export interface HighlightProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Highlight: React.FC<HighlightProps>;
export default Highlight;
