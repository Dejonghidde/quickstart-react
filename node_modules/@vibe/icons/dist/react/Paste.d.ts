import * as React from 'react';
export interface PasteProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Paste: React.FC<PasteProps>;
export default Paste;
