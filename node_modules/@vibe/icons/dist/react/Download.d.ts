import * as React from 'react';
export interface DownloadProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Download: React.FC<DownloadProps>;
export default Download;
