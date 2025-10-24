import * as React from 'react';
export interface CounterProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Counter: React.FC<CounterProps>;
export default Counter;
