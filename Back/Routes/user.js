const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/Users');
const router = express.Router();
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    console.log(req.body);
    const { pseudo, email, password } = req.body;


    if (!pseudo || !email || !password) {
        return res.status(400).json({ message: 'Pseudo, email, and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Your account already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            pseudo,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during registration' });
    }
});

router.get('/signup', async (req, res) => {
    res.send('Signup page');
});


router.post('/login', async (req, res) => {
    const { email, password, pseudo } = req.body;

    if (!email && !pseudo) {
        return res.status(400).json({ message: 'Email or pseudo is required' });
    }

    try {
        const user = await User.findOne({ $or: [{ email }, { pseudo }] });

        if (!user) {
            return res.status(400).json({ message: 'Wrong email or pseudo' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            { userId: user._id, pseudo: user.pseudo },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: `Welcome ${user.pseudo}`,
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during login' });
    }
});

module.exports = router;