import * as React from 'react';
export interface IdeaProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Idea: React.FC<IdeaProps>;
export default Idea;
