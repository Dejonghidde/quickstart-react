import * as React from 'react';
export interface TagsProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Tags: React.FC<TagsProps>;
export default Tags;
