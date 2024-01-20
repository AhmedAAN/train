const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mealSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String
    },
    calories: {
        type: Number
    }
}, { timestamps: true });

const Meal = mongoose.model("meal", mealSchema);
module.exports = Meal;