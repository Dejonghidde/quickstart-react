import * as React from 'react';
export interface PersonProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Person: React.FC<PersonProps>;
export default Person;
