/* Libraries */
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/* Application files */
const HttpError = require('../models/http-error');
const Workout = require('../models/workout');
const User = require('../models/user');


async function getWorkoutDaysByUserId(req, res, next) {
    const creatorId = req.params.uid;

    let workoutDays;

    try {
        workoutDays = await Workout.find({ creator: creatorId });
    } catch (err) {
        return next(new HttpError('Fetching workout days failed, please try again later.', 500));
    }

    if (!workoutDays || workoutDays.length === 0) {
        return next(new HttpError('Could not find a workout days for the provided user id.', 404));
    }

    res.json({ workouts: workoutDays.map(workout => workout.toObject({ getters: true })) });
}

async function createWorkoutDays(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Something went wrong, try again later', 422));
    }

    const { creator } = req.body;

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

        for (let i = 0; i < daysOfWeek.length; i++) {
            const newWorkoutDay = new Workout({
                day: daysOfWeek[i],
                exercises: '',
                creator
            });

            await newWorkoutDay.save({ session });
            user.workouts.push(newWorkoutDay);
        }

        await user.save({ session });
        await session.commitTransaction();

    } catch (err) {
        const error = new HttpError('Creating workout days failed.', 500);
        return next(error);
    }

    res.status(201).json({ message: 'Workout days created successfully.' });
}

async function updateWorkoutDay(req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { exercises } = req.body;
    const workoutId = req.params.wid;
    
    let workout
    try {
        workout = await Workout.findById(workoutId);
    } catch (err) {
        return next(new HttpError('Could not find the workout day.', 500));
    }

    workout.exercises = exercises;

    try {
        await workout.save();
    } catch (err) {
        return next(new HttpError('Could not update the workout', 500));
    }

    res.status(200).json({ workout: workout.toObject({ getters: true }) });
}

exports.getWorkoutDaysByUserId = getWorkoutDaysByUserId;
exports.createWorkoutDays = createWorkoutDays;
exports.updateWorkoutDay = updateWorkoutDay;
