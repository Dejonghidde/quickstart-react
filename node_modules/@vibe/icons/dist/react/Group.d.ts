import * as React from 'react';
export interface GroupProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Group: React.FC<GroupProps>;
export default Group;
