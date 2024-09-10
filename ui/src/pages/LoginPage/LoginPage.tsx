/* Libraries */
import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/* Application files */
import ImageUpload from '../../components/ImageUpload';
import { AuthContext } from '../../context';
import useHttpClient from '../../hooks/http-hook';



export function LoginPage() {

    const auth = useContext(AuthContext);

    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        password: '',
        image: null
    })

    const [ formErrors, setFormErrors ] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [ isLoginMode, setIsLoginMode ] = useState(true);

    // const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const { isLoading, sendRequest } = useHttpClient();

    const expirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

    function handleModeSwitch() {
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

    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
    }

    function handleValidateInput(e: React.FocusEvent<HTMLInputElement>) {
        switch (e.target.name) {
            case 'name':
            if (e.target.value === '') {
                setFormErrors(prevState => ({
                ...prevState,
                name: "Field required"
                }));
            } else {
                setFormErrors(prevState => ({
                ...prevState,
                name: ""
                }));
            }
            break;
            case 'email':
            if (e.target.value === '') {
                setFormErrors(prevState => ({
                ...prevState,
                email: "Field required"
                }));
            } else if (!isValidEmail(e.target.value)) {
                setFormErrors(prevState => ({
                ...prevState,
                email: "Invalid email"
                }));
            } else {
                setFormErrors(prevState => ({
                ...prevState,
                email: ""
                }));
            }
            break;
            case 'password':
            if (e.target.value === '') {
                setFormErrors(prevState => ({
                ...prevState,
                password: "Field required"
                }));
            } else if (e.target.value.length < 6) {
                setFormErrors(prevState => ({
                ...prevState,
                password: "Password must be at least 6 characters"
                }));
            } else {
                setFormErrors(prevState => ({
                ...prevState,
                password: ""
                }));
            }
            break;
            default:
            break;
        }
    }

    function handleInputChange (e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'name') setFormErrors(prevState => ({
            ...prevState,
            name: ""
        }));
        if (name === 'email') setFormErrors(prevState => ({
            ...prevState,
            email: ""
        }));
        if (name === 'password') setFormErrors(prevState => ({
            ...prevState,
            password: ""
        }));
    }

    function handleImageInput (image: any) {
        setFormData(prevState => ({
            ...prevState,
            image: image
        }));
    }

    function handleValidation() {
        if (isLoginMode) {
            if (!formData.email || !formData.password || !isValidEmail(formData.email) || formData.password.length < 6) {
                return false;
            }
        } else {
            if (!formData.name || !formData.email || !formData.password || !isValidEmail(formData.email) || formData.password.length < 6) {
                return false;
            }
        }
        return true;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        
        if (!handleValidation()) {
            //adds some allert visible to the user here
            console.log('Form is invalid');
            return;
        }

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:3000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    }),
                    {
                        'Content-Type': 'application/json'
                    },
                );

                auth.onLogin(responseData.userId, responseData.name, responseData.token, expirationDate);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const appendedFormData = new FormData();

                appendedFormData.append('name', formData.name);
                appendedFormData.append('email', formData.email);
                appendedFormData.append('password', formData.password);
                appendedFormData.append('image', formData.image);

                const responseData = await sendRequest(
                    'http://localhost:3000/api/users/signup',
                    'POST',
                    appendedFormData
                );

                auth.onLogin(responseData.userId, responseData.name, responseData.token, expirationDate);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <React.Fragment>
            <h1>{isLoginMode ? "Login" : "Register"}</h1>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                {isLoading && <CircularProgress />}
                {!isLoginMode && (
                    <TextField
                        id='name' 
                        label='User Name' 
                        variant='outlined' 
                        type='text' 
                        size='small'
                        name='name'
                        onBlur={handleValidateInput} 
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        onChange={handleInputChange}
                    />
                )}
                {!isLoginMode && 
                    <ImageUpload 
                        id="image"
                        errorText="Please provide an image"
                        onInput={handleImageInput}
                    />
                }
                <TextField
                    id='email' 
                    label='Email' 
                    variant='outlined' 
                    type='email' 
                    size='small'
                    name='email'
                    onBlur={handleValidateInput} 
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    onChange={handleInputChange}
                />
                <TextField
                    id='password' 
                    label='Password' 
                    variant='outlined' 
                    type='password' 
                    size='small'
                    name='password'
                    onBlur={handleValidateInput} 
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    onChange={handleInputChange}
                />
                <Button variant="contained" type="submit">
                    {isLoginMode ? "Login" : "Signup"}
                </Button>
            </Box>
       
            <Button variant="contained" onClick={handleModeSwitch}>
                Switch to {isLoginMode ? "Signup" : "Login"}
            </Button>
        </React.Fragment>
    );
}

export default LoginPage;
