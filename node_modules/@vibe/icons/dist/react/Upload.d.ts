import * as React from 'react';
export interface UploadProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Upload: React.FC<UploadProps>;
export default Upload;
