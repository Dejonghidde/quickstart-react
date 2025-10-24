import * as React from 'react';
export interface TableProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Table: React.FC<TableProps>;
export default Table;
