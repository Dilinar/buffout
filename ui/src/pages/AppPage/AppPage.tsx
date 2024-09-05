/* Libraries */
import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

/* Application files */
import ProtCalculatorPage from '../ProtCalculatorPage';
import LoginPage from '../LoginPage';
import UserPage from '../UserPage';
import UsersListPage from '../UsersListPage';
import { AuthContext } from '../../context';

export function AppPage() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    const login = useCallback((uid: string, userName: string) => {
        setIsLoggedIn(true);
        setUserId(uid);
        setUserName(userName);
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUserId(null);
        setUserName(null);
    }, []);

    let routes;

    if (isLoggedIn) {
        routes = (
            <Routes>
                <Route path="/" element={<ProtCalculatorPage />} />
                <Route path="/account/:userId" element={<UserPage />} />
                <Route path="/users" element={<UsersListPage/>} />
                <Route path="*" element={<Navigate to={`/account/${userId}`} />} />
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
        <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, userId: userId, userName: userName, onLogin: login,  onLogout: logout }}>
            <Router>
                <Paper>
                    <Link to="/">
                        <Button variant="contained">
                            Calculator
                        </Button>
                    </Link>
                    {!isLoggedIn &&
                        <Link to="/login">
                            <Button variant="contained">
                                Login
                            </Button>
                        </Link>
                    }   
                    {isLoggedIn &&
                        <Link to={`/account/${userId}`}>
                            <Button variant="contained">
                                My Account
                            </Button>
                        </Link>
                    }
                    {isLoggedIn &&
                        <Link to="/users">
                            <Button variant="contained">
                                All users
                            </Button>
                        </Link>
                    }
                    {routes}
                </Paper>
            </Router>
        </AuthContext.Provider>
    );
}

export default AppPage;
