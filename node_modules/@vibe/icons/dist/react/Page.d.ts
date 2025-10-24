import * as React from 'react';
export interface PageProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const Page: React.FC<PageProps>;
export default Page;
