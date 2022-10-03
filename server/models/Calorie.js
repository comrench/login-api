const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const calorieSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    meal: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

calorieSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

module.exports = mongoose.model('Calorie', calorieSchema);
