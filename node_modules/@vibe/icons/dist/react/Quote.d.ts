import * as React from 'react';
export interface QuoteProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Quote: React.FC<QuoteProps>;
export default Quote;
