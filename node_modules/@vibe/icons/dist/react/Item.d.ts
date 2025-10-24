import * as React from 'react';
export interface ItemProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Item: React.FC<ItemProps>;
export default Item;
