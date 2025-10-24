import * as React from 'react';
export interface CommentProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Comment: React.FC<CommentProps>;
export default Comment;
