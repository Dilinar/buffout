import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import useHttpClient from '../../hooks/http-hook';
import { AuthContext } from '../../context';

export function UserPage() {

    const auth = useContext(AuthContext)

    const { isLoading, error, sendRequest } = useHttpClient();
    
    const [ loadedWorkouts, setLoadedWorkouts ] = useState([]);
    const [ loadedGoals, setLoadedGoals ] = useState([]);
    const [ loadedProducts, setLoadedProducts ] = useState([]);
    
    interface User {
        id: string;
        name: string;
        // Add other properties as needed
    }
    
    const [loadedUser, setLodedUser] = useState<User | null>(null);

    const [ dialogInfo, setDialogInfo ] = useState({
        isOpen: false,
        title: '',
        id: ''
    });

    const [ selectedExercises, setSelectedExercises ] = useState('');

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

    async function fetchWorkouts() {

        try {
            const responseData = await sendRequest(`http://localhost:3000/api/workouts/${userId}`);

            setLoadedWorkouts(responseData.workouts);
        } catch (error: any) {

        }
    };

    useEffect(() => {

        const fetchUser = async () => {

            try {
                const responseData = await sendRequest(`http://localhost:3000/api/users/${userId}`);

                setLodedUser(responseData.user);
            } catch (error: any) {

            }
        }


        const fetchGoals = async () => {

            try {
                const responseData = await sendRequest(`http://localhost:3000/api/goals/${userId}`);

                setLoadedGoals(responseData.goals);
            } catch (error: any) {

            }
        }



        const fetchProducts = async () => {

            try {
                const responseData = await sendRequest(`http://localhost:3000/api/products/${userId}`);

                setLoadedProducts(responseData.products);
            } catch (error: any) {

            }
        }

        fetchUser();
        fetchGoals();
        fetchWorkouts();
        fetchProducts();
    }, [sendRequest, userId]);

    // function handleErrors() {
    //     setError(null);
    // }

    function handleDialogOpen(title: string, id: string, exercises: string) {
        setSelectedExercises(exercises);
        setDialogInfo({
            isOpen: true,
            title: title,
            id: id
        });
    }

    function handleWorkoutUpdate(event: React.FormEvent) {
        event.preventDefault();

        const dayIdIndex = loadedWorkouts.findIndex((workout: any) => workout.id === dialogInfo.id);

        sendRequest(
            `http://localhost:3000/api/workouts/${dialogInfo.id}`,
            'PATCH',
            JSON.stringify({
                exercises: selectedExercises
            }),
            {
                'Content-Type': 'application/json'
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
    }

    async function handleDeleteProduct(productId: string) {
        try {
            await sendRequest(
                `http://localhost:3000/api/products/${productId}`,
                'DELETE'
            );

            setLoadedProducts(loadedProducts.filter((product: any) => product.id !== productId));
        } catch (err) {
            console.error(err);
        }
    }

    function handleDialogClose() {
        setDialogInfo({
            isOpen: false,
            title: '',
            id: ''
        });
    }

    return (
        <React.Fragment>
            {isLoading && <CircularProgress />}
            {error && <div>{error}</div>}
            <h1>{!loadedUser ? null : loadedUser.name}</h1>
            <div>
                <h2>Goals</h2>
                {loadedGoals.map(goals => (
                    <p key={goals.id}>{goals.goals}</p>
                ))}
            </div>
            <ul>
                {loadedWorkouts.map(workout => (
                    <li key={workout.id}>
                        <h3>{workout.day}</h3>
                        <p>{workout.exercises}</p>
                        {auth.userId === userId &&
                            <Button onClick={() => handleDialogOpen(workout.day,workout.id, workout.exercises)}>
                                Update
                            </Button>
                        }
                    </li>
                ))}
            </ul>
            <ul>
                {loadedProducts.map(product => (
                    <li key={product.id}>
                        <h3>{product.name}</h3>
                        <p>Protein: {product.protein}</p>
                        <p>Calories: {product.calories}</p>
                        <p>Price: {product.proce}</p>
                        <p>Calories per 1g of protein: {product.caloriesPerProtein}</p>
                        <p>Price of 1g of protein: {product.priceOfProtein}</p>
                        {auth.userId === userId &&
                            <>
                                <Button>
                                    Update
                                </Button>
                                <Button onClick={() => handleDeleteProduct(product.id)}>
                                    Delete
                                </Button>
                            </>
                        }
                    </li>
                ))}
            </ul>
            <Dialog onClose={handleDialogClose} open={dialogInfo.isOpen}>
                <DialogTitle>
                    {dialogInfo.title}
                </DialogTitle>
                <Box
                    component="form"
                    onSubmit={handleWorkoutUpdate}
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="Exercises"
                        label="Workout for the day"
                        variant='outlined' 
                        type='text' 
                        size='small'
                        multiline
                        value={selectedExercises}
                        onChange={(e) => setSelectedExercises(e.target.value )}
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
