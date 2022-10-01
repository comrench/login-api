const express = require('express');
const router = express.Router();
const calorieController = require('../controllers/calorieController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router
  .route('/')
  .get(calorieController.getAllCalorie)
  .post(calorieController.createNewCalorie)
  .patch(calorieController.updateCalorie)
  .delete(calorieController.deleteCalorie);

module.exports = router;
