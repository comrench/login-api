const express = require('express');
const router = express.Router();
const calorieController = require('../controllers/calorieController');

router
  .route('/')
  .get(calorieController.getAllCalorie)
  .post(calorieController.createNewCalorie)
  .patch(calorieController.updateCalorie)
  .delete(calorieController.deleteCalorie);

module.exports = router;
