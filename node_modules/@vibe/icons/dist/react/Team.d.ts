import * as React from 'react';
export interface TeamProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Team: React.FC<TeamProps>;
export default Team;
