import React from "react";

import List from "@mui/material/List";


import UserItem from "../UserItem";

export function UsersList(props: any) {

    if (props.items.length === 0) {
        return(
            <div>
                <h2>No users found.</h2>
            </div>
        );
    }

    return (
        <React.Fragment>
            <h1>UsersList</h1>
            <List>
                {props.items.map((user: any) => (
                    <UserItem key={user.id} id={user.id} image={user.image} name={user.name}/>
                ))}
            </List>
        </ React.Fragment>
    );
}

export default UsersList;
