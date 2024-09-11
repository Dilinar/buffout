/* Libraries */
const express = require('express');

/* Application files */
const goalsController = require('../controllers/goals-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:uid', goalsController.getGoalsByUserId);

router.post('/create', goalsController.createGoals);

router.patch('/:gid', goalsController.updateGoals);

module.exports = router;
