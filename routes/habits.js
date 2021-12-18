// importing express module
const express = require('express');

// setting up the router
const router = express.Router();

// importing Habit schema
const Habit = require('../models/Habit');

var view = 'daily';

// Redirects back to the site
router.get('/appname', (req, res) => {
    res.redirect('back');
});

// List of habits in daily view
router.get('/daily-view', (req, res) => {
    view = 'daily';
    res.redirect('back');
});

// List of habits in weekly view
router.get('/weekly-view', (req, res) => {
    view = 'weekly';
    res.redirect('back');
});

// function to return day and date
function getDayAndDate(n) {
    let d = new Date();
    d.setDate(d.getDate() - n);
    var newDate = d.toLocaleDateString('pt-br').split('/').reverse().join('-');
    var day;
    switch (d.getDay()) {
        case 0: day = 'Sun';
            break;
        case 1: day = 'Mon';
            break;
        case 2: day = 'Tue';
            break;
        case 3: day = 'Wed';
            break;
        case 4: day = 'Thu';
            break;
        case 5: day = 'Fri';
            break;
        case 6: day = 'Sat';
            break;
    }
    return { date: newDate, day };
}

// gets all the habits stored in db
router.get('/', (req, res) => {
    Habit.find({}, (err, habits) => {
        if (err) {
            console.log(err);
        } else {
            var days = [];
            days.push(getDayAndDate(0));
            days.push(getDayAndDate(1));
            days.push(getDayAndDate(2));
            days.push(getDayAndDate(3));
            days.push(getDayAndDate(4));
            days.push(getDayAndDate(5));
            days.push(getDayAndDate(6));
            res.render('home', { habits, view, days });
        }
    })
})

// to add new habit
router.post('/add-habit', (req, res) => {
    const { habitName } = req.body;

    Habit.findOne({ habitName: habitName }).then(habit => {
        if (habit) {
            let dates = habit.dates, tzoffset = (new Date()).getTimezoneOffset() * 60000;
            var today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
            dates.find(function (item, index) {
                if (item.date === today) {
                    console.log("Habit exists!")

                    res.redirect('back');
                }
                else {
                    dates.push({ date: today, complete: 'none' });
                    habit.dates = dates;
                    habit.save()
                        .then(habit => {
                            res.redirect('back');
                        })
                        .catch(err => console.log(err));
                }
            });
        }
        else {
            let dates = [], tzoffset = (new Date()).getTimezoneOffset() * 60000;
            var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
            dates.push({ date: localISOTime, complete: 'none' });
            const newHabit = new Habit({
                habitName,
                dates
            });

            newHabit
                .save()
                .then(habit => {
                    res.redirect('back');
                })
                .catch(err => console.log(err));
        }
    })
});

// set or remove habit as favourite
router.get("/favourite", (req, res) => {
    let id = req.query.id;
    Habit.findOne({
        _id: {
            $in: [
                id
            ]
        }
    })
        .then(habit => {
            habit.favourite = habit.favourite ? false : true;
            habit.save()
                .then(habit => {
                    return res.redirect('back');
                })
                .catch(err => console.log(err));
        })
        .catch(err => {
            console.log("Error adding to favourites!");
            return;
        })
});

// update status if habit is completed or not
router.get("/status", (req, res) => {
    var d = req.query.date;
    var id = req.query.id;
    Habit.findById(id, (err, habit) => {
        if (err) {
            console.log("Error updating status!")
        }
        else {
            let dates = habit.dates;
            let found = false;
            dates.find(function (item, index) {
                if (item.date === d) {
                    if (item.complete === 'yes') {
                        item.complete = 'no';
                    }
                    else if (item.complete === 'no') {
                        item.complete = 'none'
                    }
                    else if (item.complete === 'none') {
                        item.complete = 'yes'
                    }
                    found = true;
                }
            })
            if (!found) {
                dates.push({ date: d, complete: 'yes' })
            }
            habit.dates = dates;
            habit.save()
                .then(habit => {
                    res.redirect('back');
                })
                .catch(err => console.log(err));
        }
    })

})

// delete a habit
router.get("/delete", (req, res) => {
    let id = req.query.id;
    Habit.deleteMany({
        _id: {
            $in: [
                id
            ]
        }
    }, (err) => {
        if (err) {
            console.log("Error in deleting record(s)!");
        }
        else {
            return res.redirect('back');
        }
    })
});

// exporting router
module.exports = router;