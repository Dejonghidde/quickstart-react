import * as React from 'react';
export interface CountryProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Country: React.FC<CountryProps>;
export default Country;
