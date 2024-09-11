import React, { useEffect, useState, useContext } from "react";
import CircularProgress from '@mui/material/CircularProgress';

import UsersList from '../../components/UsersList';
import useHttpClient from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';

export function UsersListPage() {

    const auth = useContext(AuthContext)

    const { isLoading, error, sendRequest } = useHttpClient();
    const [ loadedUsers, setLoadedUsers ] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {

            try {
                const responseData = await sendRequest('http://localhost:3000/api/users',
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }
                );

                setLoadedUsers(responseData.users);
            } catch (error: any) {

            }
        }
        fetchUsers();
    }, [sendRequest]);

    // function handleErrors() {
    //     setError(null);
    // }

    return (
        <React.Fragment>
            {isLoading && <CircularProgress />}
            {error && <div>{error}</div>}
            {!isLoading && loadedUsers &&
                <UsersList items={loadedUsers} />
            }
        </React.Fragment>
    );
}

export default UsersListPage;
