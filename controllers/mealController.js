const User = require('../models/User');
const Meal = require('../models/Meal');



module.exports.createMeal_get = async (req, res) => {
    const userId = req.cookies.user_id;
    const user = await User.findById(userId);
    res.render('pages/mealCreate.ejs', { title: "Create Meal", user: user.name })
}

module.exports.createMeal_post = async (req, res) => {
    const { name, calories } = req.body;
    const userID = req.cookies.user_id;
    try {
        let meal = new Meal({ user: userID, name: name, calories: calories });
        await meal.save();

        let user = await User.findById(userID);
        let mealID = meal._id;
        user.meals.push(mealID);
        await user.save();

        res.status(201).json({ meal: meal._id });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports.meals_get = async (req, res) => {
    const userId = req.cookies.user_id;
    const user = await User.findById(userId);
    if (!user) {
        res.redirect("/login")
    }

    let mealIDs = user.meals;
    let meals = [];

    for (let mealID of mealIDs) {
        let meal = await Meal.findById(mealID);
        meals.push(meal);
    }

    res.render('pages/meals.ejs', { title: "Your Meals", user: user.name, meals: meals })
}

module.exports.oneMeal_get = async (req, res) => {
    const mealID = req.params.id;
    const userID = req.cookies.user_id;
    const user = await User.findById(userID);
    const meal = await Meal.findById(mealID);
    const creator = meal.user;

    if (creator != userID) {
        res.render('pages/404.ejs', { title: "404", user: user.name });
    }
    else {
        res.render('pages/oneNote.ejs', { title: "One Note", user: user.name, meal: meal })
    }
}

module.exports.oneMeal_delete = (req, res) => {
    const id = req.params.id;
    Note.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/notes' });
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports.updateMeal_get = async (req, res) => {
    const id = req.params.id;
    const userId = req.cookies.user_id;
    const user = await User.findById(userId);
    const note = await Note.findById(id);
    const author = note.author;

    if (author != userId) {
        res.render('pages/404.ejs', { title: "404", user: user.name });
    }
    else {
        res.render('pages/noteUpdate.ejs', { title: "Note Update", user: user.name, note: note })
    }
};

module.exports.oneMeal_update = (req, res) => {
    const id = req.params.id;
    Note.findByIdAndUpdate(id, req.body)
        .then(result => {
            res.redirect(`/notes/${id}`);
        })
        .catch(err => {
            console.log(err);
        });
};