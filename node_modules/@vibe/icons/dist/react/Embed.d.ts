import * as React from 'react';
export interface EmbedProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Embed: React.FC<EmbedProps>;
export default Embed;
