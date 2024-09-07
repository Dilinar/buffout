// The controller is responsible for handling the incoming requests and returning the response to the client.

/* Libraries */
const { validationResult } = require('express-validator');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* Application files */
const HttpError = require('../models/http-error');
const User = require('../models/user');
const { createWorkoutDays } = require('../controllers/workouts-controller');
const { createGoals } = require('../controllers/goals-controller');
const user = require('../models/user');

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
        return next(new HttpError('User name taken, please choose a different one.', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        return next(new HttpError('Could not create user, please try again.', 500));    
    }

    const newUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        products: [],
        workouts: []
    });

    try {
        await newUser.save();
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, email: newUser.email, name: newUser.name },
            'super_top_secret_code_dont_share_with_anyone_ever_04021190',
            { expiresIn: '1h' }
        );
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }
    //Call these via button in the UserPage
    // try {
    //     await createWorkoutDays({ body: { creator: newUser.id } }, res, next);
    // } catch (err) {
    //     return next(new HttpError('Creating workout days failed, please try again.', 500));
    // }

    // try {
    //     await createGoals({ body: { creator: newUser.id } }, res, next);
    // } catch (err) {
    //     return next(new HttpError('Creating goals failed, please try again.', 500));
    // }
    res.status(201).json({ userId: newUser.id, email: newUser.email, name: newUser.name, token: token });
    
}

async function login(req, res, next) {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return next(new HttpError('Loggin in failed, please try again.', 500));
    }

    if (!existingUser) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(new HttpError('Could not log you in, please check your credentials and try again.', 500));
    }

    if (!isValidPassword) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email, name: existingUser.name },
            'super_top_secret_code_dont_share_with_anyone_ever_04021190',
            { expiresIn: '1h' }
        );
    } catch (err) {
        return next(new HttpError('Logging in failed, please try again.', 500));
    }

    res.json({ userId: existingUser.id, email: existingUser.email, name: existingUser.name, token: token });
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
        return next(new HttpError('Could not find the user.', 500));
    }

    const imagePath = user.image;

    try {
        await user.deleteOne();
    } catch (err) {
        return next(new HttpError('Could not delete the user.', 500));
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    });

    res.status(200).json({ message: 'User deleted.' });
}

exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.signUp = signUp;
exports.login = login;
// exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
