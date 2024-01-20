const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { isEmail } = require('validator')

const Schema = mongoose.Schema;
const userCredentialSchema = new Schema({
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, "please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minLength: [6, 'minimum password length is 6']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });


userCredentialSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userCredentialSchema.statics.login = async function (email, password) {

    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}
const UserCredential = mongoose.model("userCredential", userCredentialSchema);
module.exports = UserCredential;