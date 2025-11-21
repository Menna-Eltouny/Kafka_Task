const express = require('express');
const ActivityController = require('../src/controllers/activityController');

const router = express.Router();
const activityController = new ActivityController();

router.post('/activities', (req, res) => activityController.createActivity(req, res));
router.get('/activities', (req, res) => activityController.getActivities(req, res));

module.exports = router;