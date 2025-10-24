import * as React from 'react';
export interface CreditCardProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const CreditCard: React.FC<CreditCardProps>;
export default CreditCard;
