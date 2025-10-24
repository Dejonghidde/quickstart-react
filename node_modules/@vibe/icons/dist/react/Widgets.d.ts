import * as React from 'react';
export interface WidgetsProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Widgets: React.FC<WidgetsProps>;
export default Widgets;
