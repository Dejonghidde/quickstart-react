import * as React from 'react';
export interface ColumnProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Column: React.FC<ColumnProps>;
export default Column;
