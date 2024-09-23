import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context';

const defaultAuthContextValue = {
    isLoggedIn: false,
    token: null as null | string,
    userId: null as null | string,
    userName: null as null | string,
    onLogin: vi.fn(),
    onLogout: vi.fn()
};

const AllProviders = ({ children, authContextValue }: { children: React.ReactNode, authContextValue?: any }) => {
    return (
        <AuthContext.Provider value={authContextValue || defaultAuthContextValue}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </AuthContext.Provider>
    );
};
// Options might not be needed
const customRender = (ui: React.ReactElement, { authContextValue, ...options }: any = {}) =>
    render(ui, { wrapper: (props) => <AllProviders {...props} authContextValue={authContextValue} />, ...options });

// export * from '@testing-library/react';
export { customRender as render };
