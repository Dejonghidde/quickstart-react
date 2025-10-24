import * as React from 'react';
export interface FolderProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Folder: React.FC<FolderProps>;
export default Folder;
