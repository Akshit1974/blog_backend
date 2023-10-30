const User = require("./models/UserSchema");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            console.log("please login to access this resource")
        }

        const decodeData = jwt.verify(token, "userToken");

        req.user = await User.findById(decodeData.id);

        next();

    } catch (error) {

    }
}

module.exports = verifyToken