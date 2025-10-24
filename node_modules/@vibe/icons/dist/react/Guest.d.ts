import * as React from 'react';
export interface GuestProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Guest: React.FC<GuestProps>;
export default Guest;
