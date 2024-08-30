// The routes are responsible for handling the incoming requests and forwarding them to the controller.

/* Libraries */
const express = require('express');
const { check } = require('express-validator');

/* Application files */
const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get('/', usersController.getAllUsers);

router.get('/:uid', usersController.getUserById);

router.post('/signup', 
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ],
    usersController.signUp);

router.post('/login', usersController.login);

// router.patch('/:uid', 
//     [
//         check('name').not().isEmpty(),
//         check('email').normalizeEmail().isEmail(),
//     ],
//     usersController.updateUser);

router.delete('/:uid', usersController.deleteUser);

module.exports = router;
