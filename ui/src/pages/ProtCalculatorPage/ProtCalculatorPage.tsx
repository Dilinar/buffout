import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


import useHtttpClient from '../../hooks/http-hook';
import { AuthContext } from '../../context';


export function ProtCalculatorPage() {

    const auth = useContext(AuthContext);

    const  { sendRequest } = useHtttpClient();

    const [ formData, setFormData ] = useState({
        name: '',
        protein: undefined,
        calories: undefined,
        price: undefined,
        caloriesPerProtein: undefined,
        priceOfProtein: undefined,
    }); 

    const navigate = useNavigate();

    async function handleProductSubmit(event: React.FormEvent) {
        event.preventDefault();
        

        const updatedFormData = {
            ...formData,
            caloriesPerProtein: (formData.calories / formData.protein).toFixed(2),
            priceOfProtein: (formData.price / formData.protein).toFixed(2),
        };
    
        setFormData(updatedFormData);

        try{
            await sendRequest(
                'http://localhost:3000/api/products/create',
                'POST',
                JSON.stringify({
                    name: formData.name,
                    protein: formData.protein,
                    calories: formData.calories,
                    price: formData.price,
                    caloriesPerProtein: formData.caloriesPerProtein,
                    priceOfProtein: formData.priceOfProtein,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            navigate(`/account/${auth.userId}`);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <React.Fragment>
            <h1>Protein calculator</h1>
            <Box
                component="form"
                onSubmit={handleProductSubmit}
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                {auth.isLoggedIn &&
                    <TextField
                        id="name"
                        label="Product name"
                        variant='outlined' 
                        type='text' 
                        size='small'
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                }
                <TextField
                    id="protein"
                    label="Protein"
                    variant='outlined' 
                    type='number' 
                    size='small'
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value as unknown as number })}
                />
                <TextField
                    id="calories"
                    label="Calories"
                    variant='outlined' 
                    type='number' 
                    size='small'
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value as unknown as number })}
                />
                <TextField
                    id="price"
                    label="Price"
                    variant='outlined' 
                    type='number' 
                    size='small'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value as unknown as number })}
                />
                <TextField
                    id="caloriesPerProtein"
                    label="Calories per 1g of protein"
                    variant='outlined' 
                    type='number' 
                    size='small'
                    disabled
                    value={(formData.calories / formData.protein).toFixed(2)}
                />
                <TextField
                    id="priceOfProtein"
                    label="Price of 1g of protein"
                    variant='outlined' 
                    type='number' 
                    size='small'
                    disabled
                    value={(formData.price / formData.protein).toFixed(2)}
                />
                {auth.userId &&
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
        }
            </Box>
        </React.Fragment>
    );
}

export default ProtCalculatorPage;
