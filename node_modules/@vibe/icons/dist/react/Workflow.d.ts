import * as React from 'react';
export interface WorkflowProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Workflow: React.FC<WorkflowProps>;
export default Workflow;
