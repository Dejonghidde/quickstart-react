import * as React from 'react';
export interface BoardTemplateProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const BoardTemplate: React.FC<BoardTemplateProps>;
export default BoardTemplate;
