/* Libraries */
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

/* Application files */
import ProtCalculatorPage from '../ProtCalculatorPage';
import LoginPage from '../LoginPage';

export function AppPage() {


    const routes = (
        <Routes>
            <Route
                path="/"
                element={<ProtCalculatorPage />}
            />
            <Route
                path="/login"
                element={<LoginPage />}
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );

    return (
        <Router>
            <Paper>
                <Button variant="contained">
                    <Link to="/">Calculator</Link>
                </Button>
                <Button variant="contained">
                    <Link to="/login">Login</Link>
                </Button>
                {routes}
            </Paper>
        </Router>
    );
}

export default AppPage;
