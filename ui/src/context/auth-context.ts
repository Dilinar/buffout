import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    userName: null,
    onLogin: (uid: string, userName: string) => {},
    onLogout: () => {}
});

export default AuthContext;
