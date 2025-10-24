import * as React from 'react';
export interface BulletProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Bullet: React.FC<BulletProps>;
export default Bullet;
