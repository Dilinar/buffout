import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";

import useHttpClient from '../../hooks/http-hook';
import { AuthContext } from '../../context';

type User = {
    id: string;
    name: string;
}

export function UserPage() {

    const auth = useContext(AuthContext)

    const { isLoading, sendRequest } = useHttpClient();
    
    const [ loadedWorkouts, setLoadedWorkouts ] = useState([]);
    const [ loadedGoals, setLoadedGoals ] = useState([]);
    const [ loadedProducts, setLoadedProducts ] = useState([]);

    
    const [ loadedUser, setLodedUser ] = useState<User | null>(null);

    const [ dialogInfo, setDialogInfo ] = useState({
        type: '',
        isOpen: false,
        title: '',
        id: ''
    });

    const [ productDialogInfo, setProductDialogInfo ] = useState({
        isOpen: false,
        title: '',
        id: ''
    });

    const [ selectedExercises, setSelectedExercises ] = useState('');
    const [ selectedGoals, setSelectedGoals ] = useState('');
    const [ selectedProduct, setSelectedProduct ] = useState({
        name: '',
        protein: null,
        calories: null,
        price: null,
    });

    // const [ formData, setFormData ] = useState({
    //     name: '',
    //     protein: undefined,
    //     calories: undefined,
    //     price: undefined,
    //     caloriesPerProtein: undefined,
    //     priceOfProtein: undefined,
    //     creator: ''
    // }); 

    const userId = useParams().userId;

    async function fetchUser() {
        try {
            const responseData = await sendRequest(`http://localhost:3000/api/users/${userId}`,
                'GET',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );

            setLodedUser(responseData.user);
        } catch (error: any) {

        }
    };

    async function fetchGoals() {
        try {
            const responseData = await sendRequest(`http://localhost:3000/api/goals/${userId}`,
                'GET',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );

            setLoadedGoals(responseData.goals);
        } catch (error: any) {

        }
    };

    async function fetchWorkouts() {
        try {
            const responseData = await sendRequest(`http://localhost:3000/api/workouts/${userId}`,
                'GET',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );

            setLoadedWorkouts(responseData.workouts);
        } catch (error: any) {

        }
    };

    async function fetchProducts() {
        try {
            const responseData = await sendRequest(`http://localhost:3000/api/products/${userId}`,
                'GET',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );

            setLoadedProducts(responseData.products);
        } catch (error: any) {

        }
    };

    async function handleCreateGoals(event: React.FormEvent) {
        event.preventDefault();

        try {
            await sendRequest(
                'http://localhost:3000/api/goals/create',
                'POST',
                JSON.stringify({
                    goals: selectedGoals,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
    
            fetchGoals();
            
            handleDialogClose();
        } catch (error: any) {
            console.error(error);
        }
    };

    async function handleUpdateGoals(event: React.FormEvent) {
        event.preventDefault();

        try {
            await sendRequest(
                `http://localhost:3000/api/goals/${dialogInfo.id}`,
                'PATCH',
                JSON.stringify({
                    goals: selectedGoals,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );

            setLoadedGoals([
                {
                    goals: selectedGoals
                }
            ]);

            handleDialogClose();
        } catch (error: any) {
            console.error(error);
        }
    };

    async function handleCreateWorkouts(event: React.FormEvent) {
        event.preventDefault();

        try {
            await sendRequest(
                'http://localhost:3000/api/workouts/create',
                'POST',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
    
            fetchWorkouts();
            
            handleDialogClose();
        } catch (error: any) {
            console.error(error);
        }
    };

    function handleUpdateWorkout(event: React.FormEvent) {
        event.preventDefault();

        const dayIdIndex = loadedWorkouts.findIndex((workout: any) => workout.id === dialogInfo.id);

        sendRequest(
            `http://localhost:3000/api/workouts/${dialogInfo.id}`,
            'PATCH',
            JSON.stringify({
                exercises: selectedExercises
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }
        );

        setLoadedWorkouts([
            ...loadedWorkouts.slice(0, dayIdIndex),
            {
                ...loadedWorkouts[dayIdIndex],
                exercises: selectedExercises
            },
            ...loadedWorkouts.slice(dayIdIndex + 1)
        ]);
        handleDialogClose();
    };

    async function handleUpdateProduct(event: React.FormEvent) {
        event.preventDefault();

        const productIdIndex = loadedProducts.findIndex((product: any) => product.id === productDialogInfo.id);

        sendRequest(
            `http://localhost:3000/api/products/${productDialogInfo.id}`,
            'PATCH',
            JSON.stringify({
                name: selectedProduct.name,
                protein: selectedProduct.protein,
                calories: selectedProduct.calories,
                price: selectedProduct.price,
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }
        );

        setLoadedProducts([
            ...loadedProducts.slice(0, productIdIndex),
            {
                ...loadedProducts[productIdIndex],
                name: selectedProduct.name,
                protein: selectedProduct.protein,
                calories: selectedProduct.calories,
                price: selectedProduct.price,
                caloriesPerProtein: selectedProduct.calories / selectedProduct.protein,
                priceOfProtein: selectedProduct.price / selectedProduct.protein
            },
            ...loadedProducts.slice(productIdIndex + 1)
        ]);
        handlePrductDialogClose();
    }

    async function handleDeleteProduct(productId: string) {
        try {
            await sendRequest(
                `http://localhost:3000/api/products/${productId}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );

            setLoadedProducts(loadedProducts.filter((product: any) => product.id !== productId));
        } catch (err) {
            console.error(err);
        }
    };

    function handleDialogOpen(type: string, title: string, id: string, data: string) {
        if(type === 'workout') {
            setSelectedExercises(data);

            setDialogInfo({
                type: type,
                isOpen: true,
                title: title,
                id: id
            });
        } else if(type === 'goals') {
            setSelectedGoals(data);

            setDialogInfo({
                type: type,
                isOpen: true,
                title: title,
                id: id
            });
        }
    };

    function handleProductDialogOpen(id: string, data: any) {

        setSelectedProduct(data);

        setProductDialogInfo({
            isOpen: true,
            title: data.name,
            id: id
        });
    };

    function handleDialogClose() {
        setDialogInfo({
            type: '',
            isOpen: false,
            title: '',
            id: ''
        });
    };

    function handlePrductDialogClose() {
        setProductDialogInfo({
            isOpen: false,
            title: '',
            id: ''
        });
    };

    useEffect(() => {

        fetchUser();
        fetchGoals();
        fetchWorkouts();
        fetchProducts();
        
    }, [userId]);

    // function handleErrors() {
    //     setError(null);
    // }

    return (
        <React.Fragment>
            {isLoading && <CircularProgress />}
            {/* {error && <div>{error}</div>} */}
            <h2>{!loadedUser ? null : loadedUser.name}</h2>
            <div>
                <h3>{!loadedUser ? null : auth.userId === userId ? 'Your goals' : `${loadedUser.name}'s goals`}</h3>
                {loadedGoals.length > 0 ? 
                    loadedGoals.map(goals => (
                        <div>
                            <Typography key={goals.id}>            
                                {goals.goals}
                            </Typography>
                        </div>
                    ))
                    : <Typography>
                        {auth.userId === userId ? 'You Have no goals yet.' : 'No goals added'}
                    </Typography>
                }
                {auth.userId === userId &&
                    <Button variant='contained' onClick={() => handleDialogOpen('goals', 'Your goals', loadedGoals.length === 0 ? null : loadedGoals[0].id, loadedGoals.length === 0 ? null : loadedGoals[0].goals || null)}>
                        {loadedGoals.length === 0 ? 'Add Goals' : 'Update Goals'}
                    </Button> 
                }
            </div>
            <div>
                <h3>{!loadedUser ? null : auth.userId === userId ? 'Your Workout plan' : `${loadedUser.name}'s workout plan`}</h3>
                {auth.userId === userId && loadedWorkouts.length === 0 ? 
                    <Button variant='contained' onClick={handleCreateWorkouts}>
                        Create Workout Plan
                    </Button>
                    : null
                }
                <ul>
                    {loadedWorkouts.map(workout => (
                        <li key={workout.id}>
                            <h4>{workout.day}</h4>
                            <pre>{workout.exercises}</pre>
                            {auth.userId === userId &&
                                <Button variant='contained' onClick={() => handleDialogOpen('workout', workout.day, workout.id, workout.exercises)}>
                                    Update
                                </Button>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>{!loadedUser ? null : auth.userId === userId ? 'Your produkts list' : `${loadedUser.name}'s produkts list`}</h3>
                {auth.userId === userId &&
                    <Link to="/">
                       <Button variant="contained">
                           Add product
                       </Button>
                   </Link>
                }
                <ul>
                    {loadedProducts.map(product => (
                        <li key={product.id}>
                            <h4>{product.name}</h4>
                            <p>Protein: {product.protein} g</p>
                            <p>Calories: {product.calories} g</p>
                            <p>Price: {product.price}</p>
                            <p>Calories per 1g of protein: {product.caloriesPerProtein.toFixed(2)} cal</p>
                            <p>Price of 1g of protein: {product.priceOfProtein.toFixed(2)}</p>
                            {auth.userId === userId &&
                                <>
                                    <Button variant='contained' onClick={() => handleProductDialogOpen(product.id, {
                                        name: product.name,
                                        protein: product.protein,
                                        calories: product.calories,
                                        price: product.price,
                                    })}>
                                        Update
                                    </Button>
                                    <Button  variant='contained' onClick={() => handleDeleteProduct(product.id)}>
                                        Delete
                                    </Button>
                                </>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            <Dialog onClose={handleDialogClose} open={dialogInfo.isOpen}>
                <DialogTitle>
                    {dialogInfo.title}
                </DialogTitle>
                <Box
                    component="form"
                    onSubmit={dialogInfo.type === 'workout' ? handleUpdateWorkout : loadedGoals.length === 0 ? handleCreateGoals : handleUpdateGoals}
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    {dialogInfo.type === 'goals' ?
                        <TextField
                            id='Goals'
                            label='Enter goals here'
                            variant='outlined' 
                            type='text' 
                            size='small'
                            multiline
                            value={selectedGoals}
                            onChange={(e) => setSelectedGoals(e.target.value )}
                        />
                        : <TextField
                            id='Workouts'
                            label='Your Workout'
                            variant='outlined' 
                            type='text' 
                            size='small'
                            multiline
                            value={selectedExercises}
                            onChange={(e) => setSelectedExercises(e.target.value )}
                        />
                    }      
                    <Button type="submit">
                        Update
                    </Button>
                </Box>
            </Dialog>
            <Dialog onClose={handlePrductDialogClose} open={productDialogInfo.isOpen}>
                <DialogTitle>
                    {productDialogInfo.title}
                </DialogTitle>
                <Box
                    component="form"
                    onSubmit={handleUpdateProduct}
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="name"
                        label="Product name"
                        variant='outlined' 
                        type='text' 
                        size='small'
                        value={selectedProduct.name}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    />
                    <TextField
                        id="protein"
                        label="Protein (in grams)"
                        variant='outlined' 
                        type='number' 
                        size='small'
                        value={selectedProduct.protein}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, protein: e.target.value as unknown as number })}
                    />
                    <TextField
                        id="calories"
                        label="Calories"
                        variant='outlined' 
                        type='number' 
                        size='small'
                        value={selectedProduct.calories}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, calories: e.target.value as unknown as number })}
                    />
                    <TextField
                        id="price"
                        label="Price"
                        variant='outlined' 
                        type='number' 
                        size='small'
                        value={selectedProduct.price}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value as unknown as number })}
                    />
                    <Button type="submit">
                        Update
                    </Button>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}

export default UserPage;
