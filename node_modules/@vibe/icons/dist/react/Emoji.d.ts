import * as React from 'react';
export interface EmojiProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Emoji: React.FC<EmojiProps>;
export default Emoji;
