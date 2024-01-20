require('dotenv').config();

const UserCredential = require('../models/UserCredential');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const jwtSecret = process.env.JWTSECRET;
const maxAge = process.env.MAXAGE;

// Handle errors
const handleErrors = (err) => {
    let errors = { email: "", password: "" };

    // Login errors
    // incorrect email error
    if (err.message === 'incorrect email') {
        errors.email = 'this email is incorrect';
    }

    // incorrect password error
    if (err.message === 'incorrect password') {
        errors.password = 'this password is incorrect';
    }

    // signup errorss
    // dublicate error
    if (err.code === 11000) {
        errors.email = 'This email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(error => {
            let errType = error.properties.path;
            errors[errType] = error.properties.message;
        })
    }

    return errors;
}

const createToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    })
}

const getUserName = async (id) => {
    if (id) {
        const user = await User.findById(id);
        const name = user.name;

        return name;
    }
    else {
        return ""
    }
}

module.exports.home_get = async (req, res) => {
    const id = req.cookies.user_id;
    const name = await getUserName(id)

    res.render('pages/main.ejs', { title: 'create blogs', user: name });
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const id = new mongoose.Types.ObjectId('111111111111111111111111');
        const userCredential = await UserCredential.create({ email: email, password: password, user: id });

        const userCredentialID = userCredential._id;

        const user = await User.create({ userCredential: userCredentialID, name: name, meals: [] });

        const userID = user._id;

        await UserCredential.findByIdAndUpdate(userCredentialID, { email: userCredential.email, password: userCredential.password, user: userID })

        const token = createToken(userCredentialID);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.cookie('user_id', userID, { maxAge: maxAge * 1000 });
        res.status(201).json({ user: userCredentialID });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await UserCredential.login(email, password);
        const token = createToken(userCredential._id);

        const user = await User.findById(userCredential.user);

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
        res.cookie('user_id', user._id, { maxAge: maxAge });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}