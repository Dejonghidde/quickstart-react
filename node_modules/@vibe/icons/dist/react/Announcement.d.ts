import * as React from 'react';
export interface AnnouncementProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Announcement: React.FC<AnnouncementProps>;
export default Announcement;
