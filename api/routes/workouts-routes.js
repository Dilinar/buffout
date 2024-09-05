/* Libraries */
const express = require('express');

/* Application files */
const workoutsController = require('../controllers/workouts-controller');

const router = express.Router();

router.get('/:uid', workoutsController.getWorkoutDaysByUserId);

router.post('/create', workoutsController.createWorkoutDays);

router.patch('/:wid', workoutsController.updateWorkoutDay);

module.exports = router;
