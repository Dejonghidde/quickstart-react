import * as React from 'react';
export interface MenuProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Menu: React.FC<MenuProps>;
export default Menu;
