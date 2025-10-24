import * as React from 'react';
export interface FavoriteProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Favorite: React.FC<FavoriteProps>;
export default Favorite;
