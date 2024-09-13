/* Libraries */
import { useState, useCallback, useEffect } from 'react';
import Paper from '@mui/material/Paper';

/* Application files */
import { AuthContext } from '../../context';
import Router from '../Router';

let logoutTimer: any;

export function App() {

    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    const login = useCallback((uid: string, userName: string, token: string, expirationDate: any) => {

        setToken(token);
        setUserId(uid);
        setUserName(userName);
        const newExpirationDate = expirationDate || new Date(new Date().getTime() + 5000);
        setTokenExpirationDate(newExpirationDate);
        localStorage.setItem('userData', JSON.stringify({ userId: uid, userName: userName, token: token, expiration: tokenExpirationDate.toISOString() }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUserName(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData');
    }, []);

    const resetTokenExpirationDate = useCallback(() => {
        if (token) {
            const newExpirationDate = new Date(new Date().getTime() + 5000);
            setTokenExpirationDate(newExpirationDate);
            localStorage.setItem('userData', JSON.stringify({ userId, userName, token, expiration: newExpirationDate.toISOString() }));
        }
    }, [token, userId, userName]);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            clearTimeout(logoutTimer);

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
    console.log(tokenExpirationDate)
    useEffect(() => {
        console.log('ding')
        const events = ['mousemove', 'mousedown', 'keypress', 'touchstart'];
        const resetExpiration = () => {
            resetTokenExpirationDate();
        };

        events.forEach(event => window.addEventListener(event, resetExpiration));

        return () => {
            events.forEach(event => window.removeEventListener(event, resetExpiration));
        };
    }, [resetTokenExpirationDate]);

    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, userName: userName, onLogin: login, onLogout: logout }}>
            <Paper>
                <Router /> 
            </Paper>
        </AuthContext.Provider>
    );
}

export default App;
