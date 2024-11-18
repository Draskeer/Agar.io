const express = require('express');
const List = require('../Models/Lists');
const User = require('../Models/Users');
const router = express.Router();
const auth = require('../Middleware/Auth');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const InviteToken = require('../Models/Invite');

router.post('/share/:id', auth, async (req, res) => {
    const listId = req.params.id;

    try {
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const inviteToken = generateInviteToken(listId);
        const expirationTime = new Date(Date.now() + 3600000);

        const newToken = new InviteToken({
            token: inviteToken,
            listId,
            expiresAt: expirationTime,
        });

        await newToken.save();

        const inviteLink = `http://localhost:3001/api/list/join/${inviteToken}`;
        res.json({ link: inviteLink });
    } catch (err) {
        console.error('Erreur lors de la génération du lien d\'invitation :', err);
        res.status(500).json({ message: 'Error generating invitation link' });
    }
});

function generateInviteToken(listId) {
    return crypto.randomBytes(16).toString('hex');
}

const invitationTokens = {};

router.post('/create', auth, async (req, res) => {
    const { name, content } = req.body;

    if (!name || !content) {
        return res.status(400).json({ message: 'Name and content are required' });
    }

    try {
        const pseudo = req.user.pseudo;

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
        console.log("Liste créée : ", newList);

        res.status(201).json({
            message: 'List created successfully',
            list: newList,
        });
    } catch (err) {
        console.error('Erreur lors de la création de la liste :', err);
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
        console.error('Erreur lors de la récupération des listes :', err);
        res.status(500).json({ message: 'Error retrieving lists' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.status(200).json({
            message: 'List retrieved successfully',
            list,
        });
    } catch (err) {
        console.error('Erreur lors de la récupération de la liste :', err);
        res.status(500).json({ message: 'Error retrieving the list' });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const list = await List.findById(id);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        if (list.owner !== req.user.pseudo) {
            return res.status(403).json({ message: 'You do not have permission to delete this list' });
        }

        await List.findByIdAndDelete(id);

        res.status(200).json({ message: 'List deleted successfully' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la liste :', err);
        res.status(500).json({ message: 'Error deleting the list' });
    }
});

router.post('/share/:id', auth, async (req, res) => {
    const listId = req.params.id;
    const list = await List.findById(listId);

    if (!list) {
        return res.status(404).json({ message: 'List not found' });
    }

    const inviteToken = generateInviteToken(listId);

    list.inviteToken = inviteToken;
    await list.save();

    invitationTokens[inviteToken] = listId;

    setTimeout(() => {
        delete invitationTokens[inviteToken];
    }, 3600000);

    const inviteLink = `http://localhost:3001/api/list/join/${inviteToken}`;
    console.log("Tokens existants :", invitationTokens);

    res.json({ link: inviteLink });
});

router.post('/join/:token', auth, async (req, res) => {
    console.log("Requête de jonction à la liste reçue");

    const { token } = req.params;
    const userId = req.user._id;
    const userPseudo = req.user.pseudo;

    console.log("User ID :", userId);
    console.log("User Pseudo :", userPseudo);

    try {
        const invite = await InviteToken.findOne({ token });

        if (!invite) {
            return res.status(404).json({ message: 'Invalid or expired invitation token' });
        }

        const listId = invite.listId;
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        if (list.writters.includes(userPseudo)) {
            console.log("test: ", list.writters);
            return res.status(400).json({ message: 'You are already a writer for this list' });
        }

        list.writters.push(userPseudo);
        await list.save();
        console.log("Liste mise à jour :", list);

        await InviteToken.deleteOne({ token });

        res.status(200).json({ message: 'You have been added as a writer to the list!' });
    } catch (err) {
        console.error('Erreur lors de la jonction à la liste :', err);
        res.status(500).json({ message: 'Error joining the list' });
    }
});

router.get('/get/tokens', async (req, res) => {
    try {
        const tokens = await InviteToken.find();
        res.status(200).json(tokens);
    } catch (err) {
        console.error('Erreur lors de la récupération des tokens :', err);
        res.status(500).json({ message: 'Error retrieving tokens' });
    }
});

router.put('/update/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;

    try {
        const list = await List.findById(id);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        if (list.owner !== req.user.pseudo) {
            if (!list.writters.includes(req.user.pseudo)) {
                return res.status(403).json({ message: 'You do not have permission to modify this list' });
            }
        }

        list.name = name;
        list.content = content;
        await list.save();

        res.status(200).json({ message: 'List updated successfully', list });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la liste :', err);
        res.status(500).json({ message: 'Error updating the list' });
    }
});

module.exports = router;