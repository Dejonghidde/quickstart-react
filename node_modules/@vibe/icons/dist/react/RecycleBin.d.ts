import * as React from 'react';
export interface RecycleBinProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const RecycleBin: React.FC<RecycleBinProps>;
export default RecycleBin;
