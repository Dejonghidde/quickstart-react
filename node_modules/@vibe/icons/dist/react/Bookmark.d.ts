import * as React from 'react';
export interface BookmarkProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Bookmark: React.FC<BookmarkProps>;
export default Bookmark;
