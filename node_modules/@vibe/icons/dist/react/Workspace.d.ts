import * as React from 'react';
export interface WorkspaceProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Workspace: React.FC<WorkspaceProps>;
export default Workspace;
