const express = require('express');
const List = require('../Models/Lists');
const User = require('../Models/Users');
const router = express.Router();


router.post('/create', async (req, res) => {
    const { name, content, pseudo } = req.body;

    if (!name || !content || !pseudo) {
        return res.status(400).json({ message: 'Name, content, and pseudo are required' });
    }

    try {
        const user = await User.findOne({ pseudo });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newList = new List({
            name,
            content,
            owner: pseudo,
            writters: [],
        });


        await newList.save();
        console.log("test: ", newList);


        res.status(201).json({
            message: 'List created successfully',
            list: newList,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating the list' });
    }
});

router.get('/', async (req, res) => {
    try {
        const lists = await List.find();
        res.status(200).json({
            message: 'Lists retrieved successfully',
            lists,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving lists' });
    }
});

module.exports = router;