import * as React from 'react';
export interface FormulaProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Formula: React.FC<FormulaProps>;
export default Formula;
