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

    const { creator, goals } = req.body;

    const newGoals = new Goal({
        goals: goals,
        creator: req.userData.userId
    });

    let user;
    
    try {
        user = await User.findById(req.userData.userId);
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
        await user.save();

        await session.commitTransaction();

    } catch (err) {
        const error = new HttpError('Creating a new product failed.', 500);
        return next(error);
    }

    res.status(201).json({ goal: newGoals });
}

const updateGoals = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { goals } = req.body;
    const goalsId = req.params.gid;

    let updatedGoals;
    try {
        updatedGoals = await Goal.findById(goalsId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update the goals.', 500);
        return next(error);
    }

    if (updatedGoals.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit these goals.', 401);
        return next(error);
    }
 
    updatedGoals.goals = goals;

    try {
        await updatedGoals.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update the goals.', 500);
        return next(error);
    }

    res.status(200).json({goal: updatedGoals.toObject({getters: true})});
};

exports.getGoalsByUserId = getGoalsByUserId;
exports.createGoals = createGoals;
exports.updateGoals = updateGoals;