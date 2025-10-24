import * as React from 'react';
export interface FileProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const File: React.FC<FileProps>;
export default File;
