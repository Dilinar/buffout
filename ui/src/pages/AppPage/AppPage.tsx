/* Libraries */
import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

/* Application files */
import ProtCalculatorPage from '../ProtCalculatorPage';
import LoginPage from '../LoginPage';
import UserPage from '../UserPage';
import UsersListPage from '../UsersListPage';
import { AuthContext } from '../../context';

let logoutTimer: any;

export function AppPage() {

    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    const login = useCallback((uid: string, userName: string, token: string, expirationDate: any) => {
        setToken(token);
        setUserId(uid);
        setUserName(userName);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify({ userId: uid, userName: userName, token: token, expiration: tokenExpirationDate.toISOString() }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUserName(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData');
    }, []);

    let routes;

    if (token) {
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

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);
    
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.userName, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, userName: userName, onLogin: login,  onLogout: logout }}>
            <Router>
                <Paper>
                    <Link to="/">
                        <Button variant="contained">
                            Calculator
                        </Button>
                    </Link>
                    {!token &&
                        <Link to="/login">
                            <Button variant="contained">
                                Login
                            </Button>
                        </Link>
                    }   
                    {token &&
                        <Link to={`/account/${userId}`}>
                            <Button variant="contained">
                                My Account
                            </Button>
                        </Link>
                    }
                    {token &&
                        <Link to="/users">
                            <Button variant="contained">
                                All users
                            </Button>
                        </Link>
                    }
                    <Button variant="contained" onClick={logout}>
                        Log Out
                    </Button>
                    {routes}
                </Paper>
            </Router>
        </AuthContext.Provider>
    );
}

export default AppPage;
