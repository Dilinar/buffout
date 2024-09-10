/* Libraries */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';

/* Application files */
import ProtCalculatorPage from '../../pages/ProtCalculatorPage';
import LoginPage from '../../pages/LoginPage';
import UserPage from '../../pages/UserPage';
import UsersListPage from '../../pages/UsersListPage';
import PageContainer from '../PageContainer';
import { AuthContext } from '../../context';

export function Router() {
    
    const auth = useContext(AuthContext);

    let routes;

    if (auth.token) {
        routes = (
            <Routes>
                <Route path="/" element={<ProtCalculatorPage />} />
                <Route path="/account/:userId" element={<UserPage />} />
                <Route path="/users" element={<UsersListPage />} />
                <Route path="*" element={<Navigate to={`/account/${auth.userId}`} />} />
            </Routes>
        );
    } else {
        routes = (
            <Routes>
                <Route path="/" element={<ProtCalculatorPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    }

    return (
        <BrowserRouter>
            <PageContainer>
                {routes}
            </PageContainer>
        </BrowserRouter>
    );
}

export default Router;
