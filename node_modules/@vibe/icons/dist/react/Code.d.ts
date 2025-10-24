import * as React from 'react';
export interface CodeProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Code: React.FC<CodeProps>;
export default Code;
