// importing mongoose module
const mongoose = require('mongoose');

// schema for Habit
const HabitSchema = new mongoose.Schema({
    habitName: {
        type: String,
        required: true
    },
    dates: [{
        date: String,
        complete: String
    }],
    favourite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// exporting Habit schema
module.exports = mongoose.model('Habit', HabitSchema);