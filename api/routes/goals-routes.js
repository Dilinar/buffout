/* Libraries */
const express = require('express');
const { check } = require('express-validator');

/* Application files */
const goalsController = require('../controllers/goals-controller');

const router = express.Router();

router.get('/:uid', goalsController.getGoalsByUserId);

router.post('/create', goalsController.createGoals);

// router.patch('/:pid', workoutsController.updateWorkoutDay);

module.exports = router;
