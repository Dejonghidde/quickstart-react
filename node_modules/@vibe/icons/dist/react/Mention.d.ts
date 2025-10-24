import * as React from 'react';
export interface MentionProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Mention: React.FC<MentionProps>;
export default Mention;
