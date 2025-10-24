import * as React from 'react';
export interface BlockQuoteProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const BlockQuote: React.FC<BlockQuoteProps>;
export default BlockQuote;
