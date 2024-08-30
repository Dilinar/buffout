/* Libraries */
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

/* Application files */
import ImageUpload from '../../components/ImageUpload';


export function LoginPage() {

    const [isLoginMode, setIsLoginMode] = useState(true);

    const switchModeHandler = () => {
        // if (!isLoginMode) {
        //     setFormData({
        //         ...formState.inputs,
        //         name: undefined,
        //         image: undefined
        //     }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        // } else {
        //     setFormData({
        //         ...formState.inputs,
        //         name: {
        //             value: '',
        //             isValid: false
        //         },
        //         image: {
        //             value: null,
        //             isValid: false
        //         }
        //     }, false);
        // }
        setIsLoginMode(prevMode => !prevMode);
    };

    return (
        <React.Fragment>
            <h1>{isLoginMode ? "Login Page" : "Register Page"}</h1>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                {!isLoginMode &&
                    <TextField
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                    />
                }
                {!isLoginMode && 
                    <ImageUpload 
                        center
                        id="image"
                        // onInput={inputHandler} 
                        errorText="Please provide an image"
                    />
                }
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                />
                <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                />
                <Button type="submit">
                    {isLoginMode ? "Login" : "Signup"}
                </Button>
            </Box>
       
            <Button variant="contained" onClick={switchModeHandler}>Switch to {isLoginMode ? "Signup" : "Login"}</Button>
        </React.Fragment>
    );
}

export default LoginPage;
