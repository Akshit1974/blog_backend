const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
}, { timestamps: true });

// =+=+=+=+=+=+=+= bcrypt Password =+=+=+=+=+=+=+=
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// =+=+=+=+=+=+=+= Token =+=+=+=+=+=+=+=
UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.SCREEAT, {
        expiresIn: "1d"
    });
};

// =+=+=+=+=+=+=+= comparePassword =+=+=+=+=+=+=+=
UserSchema.methods.comparePassword = async function (enterPassword) {
    return bcrypt.compare(enterPassword,this.password);
};

module.exports = mongoose.model("User", UserSchema);