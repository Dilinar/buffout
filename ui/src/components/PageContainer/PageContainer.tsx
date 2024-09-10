/* Libraries */
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
}

/* Application files */
import Header from '../Header';

export function PageContainer({ children }: Props) {


    return (
        <div>
            <Header />
            {children}
        </div>
    );
}

export default PageContainer;
