import * as React from 'react';
export interface MyWeekProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const MyWeek: React.FC<MyWeekProps>;
export default MyWeek;
