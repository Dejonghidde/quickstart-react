import * as React from 'react';
export interface ExternalPageProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
}
declare const ExternalPage: React.FC<ExternalPageProps>;
export default ExternalPage;
