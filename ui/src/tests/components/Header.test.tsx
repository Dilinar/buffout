import { screen, cleanup } from '@testing-library/react';

import { Header } from '../../components/Header';
import { render } from '../test-utils';

const mockAuthContextValue = {
    isLoggedIn: false,
    token: null as null | string,
    userId: null as null | string,
    userName: null as null | string,
    onLogin: vi.fn(),
    onLogout: vi.fn()
};

const mockLoggedInAuthContextValue = {
    isLoggedIn: true,
    token: 'mockToken',
    userId: 'mockUserId',
    userName: 'mockUserName',
    onLogin: vi.fn(),
    onLogout: vi.fn()
};

describe('Header', () => {
    describe('Default components behavior', () => {
        afterEach(() => { cleanup() });

        it('renders app name and calculator button', () => {
            render(<Header />, { authContextValue: mockAuthContextValue });

            const heading = screen.getByRole('heading', { name: /buffout/i });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent(/buffout/i);

            const button = screen.getByRole('button', { name: /calculator/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent(/calculator/i);
        });
    });

    describe('Unauthenticated User behavior', () => {
        afterEach(() => { cleanup() });
        
        it('renders login button for unauthenticated user', () => {
            render(<Header />, { authContextValue: mockAuthContextValue });

            const button = screen.getByRole('button', { name: /login/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent(/login/i);
        });
    });

    describe('Authenticated User behavior', () => {
        afterEach(() => { cleanup() });
        
        it('renders account, users and logout buttons for authenticated user', () => {
            render(<Header />, { authContextValue: mockLoggedInAuthContextValue });

            const accountButton = screen.getByRole('button', { name: /account/i });
            expect(accountButton).toBeInTheDocument();
            expect(accountButton).toHaveTextContent(/account/i);

            const usersButton = screen.getByRole('button', { name: /users/i });
            expect(usersButton).toBeInTheDocument();
            expect(usersButton).toHaveTextContent(/users/i);

            const logoutButton = screen.getByRole('button', { name: /out/i });
            expect(logoutButton).toBeInTheDocument();
            expect(logoutButton).toHaveTextContent(/out/i);
        });
    });
});
