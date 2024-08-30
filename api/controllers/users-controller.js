// The controller is responsible for handling the incoming requests and returning the response to the client.

/* Libraries */
const { validationResult } = require('express-validator');

/* Application files */
const HttpError = require('../models/http-error');
const User = require('../models/user');

let DUMMY_USERS = [
    { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password1' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password2' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', password: 'password3' }
];

async function getAllUsers(req, res, next) {
    let users

    try {
        users = await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError('Fetching users failed, please try again later.', 500));
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });
}

async function getUserById(req, res, next) {
    const userId = req.params.uid;

    let user

    try {
        user = await User.findById(userId);
    } catch (err) {
        return next(new HttpError('Fetching user failed, please try again later.', 500));
    }

    res.json({ user: user.toObject({ getters: true }) });
}

async function signUp(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, email, password } = req.body;

    let existingUserEmail;
    try {
        existingUserEmail = await User.findOne({ email });
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    let existingUserName;
    try {
        existingUserName = await User.findOne({ name });
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    if (existingUserEmail) {
        return next(new HttpError('User exists already, please login instead.', 422));
    } else if (existingUserName) {
        return next(new HttpError('Username exists already, please choose another.', 422));
    }

    const newUser = new User({
        name,
        email,
        image: 'https://via.placeholder.com/150',
        password,
        products: []
    });

    try {
        await newUser.save();
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }
    
    res.status(201).json({ user: newUser.toObject({ getters: true }) });
}

async function login(req, res, next) {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return next(new HttpError('Loggin in failed, please try again.', 500));
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401));
    }

    res.json({ message: 'Logged in!' });
}

// async function updateUser(req, res, next) {

//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return next(new HttpError('Invalid inputs passed, please check your data.', 422));
//     }

//     const { name, image } = req.body;
//     const userId = req.params.uid;
    
//     let user
//     try {
//         user = await User.findById(userId);
//     } catch (err) {
//         return next(new HttpError('Could not find the user.', 500));
//     }

//     user.name = name;
//     user.image = image;

//     try {
//         await user.save();
//     } catch (err) {
//         return next(new HttpError('Could not update user.', 500));
//     }

//     res.status(200).json({ user: user.toObject({ getters: true }) });
// }

async function deleteUser(req, res, next) {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        return next(new HttpError('Could not find the product.', 500));
    }

    try {
        await user.deleteOne();
    } catch (err) {
        return next(new HttpError('Could not delete the product.', 500));
    }

    res.status(200).json({ message: 'User deleted.' });
}

exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.signUp = signUp;
exports.login = login;
// exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
