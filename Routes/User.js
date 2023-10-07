const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { requireLogin } = require("../Middleware/Auth");

//ROUTES

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "user already exist" });
        }
        const hash_password = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hash_password,
        });
        await user.save();
        return res.status(201).json({ message: "user created successfully" });
    } catch (err) {
        console.log(err.message);
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "invalid credential" });
        }
        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "invalid credential" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.json({ token });
    } catch (error) {
        console.log(err);
    }
});

router.get("/", requireLogin, async (req, res) => {
    console.log(req.user);
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (err) {
        console.log(err);
    }
});



module.exports = router;
