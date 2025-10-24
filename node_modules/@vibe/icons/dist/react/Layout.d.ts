import * as React from 'react';
export interface LayoutProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Layout: React.FC<LayoutProps>;
export default Layout;
