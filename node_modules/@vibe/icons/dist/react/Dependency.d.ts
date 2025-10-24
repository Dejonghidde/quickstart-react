import * as React from 'react';
export interface DependencyProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Dependency: React.FC<DependencyProps>;
export default Dependency;
