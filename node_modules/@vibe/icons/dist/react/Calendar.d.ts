import * as React from 'react';
export interface CalendarProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Calendar: React.FC<CalendarProps>;
export default Calendar;
