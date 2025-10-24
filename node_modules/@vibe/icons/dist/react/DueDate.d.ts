import * as React from 'react';
export interface DueDateProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const DueDate: React.FC<DueDateProps>;
export default DueDate;
