const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
var cookieParser = require('cookie-parser');
const multer = require("multer");
const path = require("path");
const app = express();

// Database
const MongoDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')
            .then(() => console.log('Connected!'));
    } catch (error) {
        console.log(error)
    }
}

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");


// Middlewares
dotenv.config();
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postsRoute);
app.use("/api/comment", commentRoute);

// Images upload on multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    console.log(req.body)
    res.status(200).json("Images has been uploaded successfully!")
})

// Server Port
app.listen(process.env.PORT, () => {
    MongoDB()
    console.log(`server start on http://localhost:${process.env.PORT}`)
});