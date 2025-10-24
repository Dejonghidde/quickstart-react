import * as React from 'react';
export interface NoteProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Note: React.FC<NoteProps>;
export default Note;
