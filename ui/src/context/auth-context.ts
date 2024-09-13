import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    userId: null,
    userName: null,
    onLogin: (uid: string, userName: string, token: string, expirationDate?: any) => {},
    onLogout: () => {}
});

export default AuthContext;
