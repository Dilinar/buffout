/* Libraries */
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/* Application files */
const HttpError = require('../models/http-error');
const Goal = require('../models/goal');
const User = require('../models/user');


async function getGoalsByUserId(req, res, next) {
    const creatorId = req.params.uid;

    let goals;

    try {
        goals = await Goal.find({ creator: creatorId });
    } catch (err) {
        return next(new HttpError('Fetching goals failed, please try again later.', 500));
    }

    if (!goals || goals.length === 0) {
        return next(new HttpError('Could not find a goals for the provided user id.', 404));
    }

    res.json({ goals: goals.map(goal => goal.toObject({ getters: true })) });
}

async function createGoals(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Something went wrong, try again later', 422));
    }

    const { creator } = req.body;

    const newGoals = new Goal({
        // title: 'Goals',
        goals: '',
        creator
    });

    let user;
    
    try {
        user = await User.findById(creator);
    } catch (err) {
        return next(new HttpError('Could not find user for provided id.', 404));
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id.', 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newGoals.save({ session });

        user.goals.push(newGoals);
        await user.save({ session });

        await session.commitTransaction();

    } catch (err) {
        const error = new HttpError('Creating a new product failed.', 500);
        return next(error);
    }


    res.status(201).json({ message: 'Workout days created successfully.' });
}

exports.getGoalsByUserId = getGoalsByUserId;
exports.createGoals = createGoals;