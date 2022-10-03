const User = require('../models/User');
const Calorie = require('../models/Calorie');
const asyncHandler = require('express-async-handler');

const MEALS = {
  Breakfast: 2,
  Lunch: 4,
  Dinner: 5,
};

// @desc Get all calories
// @route Get /calorie
// @access Private
const getAllCalorie = asyncHandler(async (req, res) => {
  // Get all calories from the database
  const calorie = await Calorie.find().select().lean();

  // If no calories
  if (!calorie?.length) {
    return res.status(400).json({ message: 'No calories found' });
  }

  // Add username to each calorie before sending the response
  const calorieWithUser = await Promise.all(
    calorie.map(async (calorie) => {
      const user = await User.findById(calorie.user).lean().exec();
      return { ...calorie, username: user.username };
    })
  );

  res.json(calorieWithUser);
});

// @desc Create new calorie
// @route POST /calorie
// @access Private
const createNewCalorie = asyncHandler(async (req, res) => {
  const { user, date, time, name, meal, quantity } = req.body;

  // Confirm data
  if (
    !user ||
    !date ||
    !time ||
    !name ||
    !meal ||
    !quantity ||
    typeof quantity !== 'number'
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicates
  // TODO: Change duplicate to unique identity i.e. date + name or something
  const duplicate = await Calorie.findOne({ name })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate calorie name' });
  }

  const calories = await Calorie.find().select().lean();
  // console.log(calories);
  let c = 0;
  // for (let cal in calories) {
  calories.forEach((cal) => {
    console.log(user, cal.user);
    if (meal === cal.meal && user == cal.user && date === cal.date) {
      c += 1;
    }
  });
  if (c >= MEALS[meal]) {
    return res.status(409).json({ message: `${meal} limit exceeded` });
  }

  // Create and store new calorie
  const calorie = await Calorie.create({
    user,
    date,
    time,
    name,
    meal,
    quantity,
  });

  if (calorie) {
    // created
    res.status(201).json({ message: `New calorie created` });
  } else {
    res.status(400).json({ message: 'Invalid calorie data received' });
  }
});

// @desc Update a calorie
// @route PATCH /calorie
// @access Private
const updateCalorie = asyncHandler(async (req, res) => {
  const { id, user, date, time, name, meal, quantity } = req.body;

  // confirm data
  if (
    !user ||
    !date ||
    !time ||
    !name ||
    !meal ||
    !quantity ||
    typeof quantity !== 'number'
  ) {
    return res.status(400).json({ message: 'All fields are requiredb!' });
  }

  // confirm calorie exists to update
  const calorie = await Calorie.findById(id).exec();

  if (!calorie) {
    return res.status(400).json({ message: 'Calorie not found' });
  }

  // Check for duplicate
  // TODO: Change duplicate to unique identity i.e. date + name or something
  const duplicate = await Calorie.findOne({ name })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original calorie
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate calorie name' });
  }

  calorie.user = user;
  calorie.date = date;
  calorie.time = time;
  calorie.name = name;
  calorie.meal = meal;
  calorie.quantity = quantity;

  const updatedCalorie = await calorie.save();

  res.json({ message: `${updatedCalorie.name} updated` });
});

// @desc Delete a calorie
// @route DELETE /calorie
// @access Private
const deleteCalorie = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Calorie ID Required' });
  }

  const calorie = await Calorie.findById(id).exec();

  if (!calorie) {
    return res.status(400).json({ message: 'Calorie not found' });
  }

  const result = await calorie.deleteOne();

  const reply = `Calorie ${result.name} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllCalorie,
  createNewCalorie,
  updateCalorie,
  deleteCalorie,
};
