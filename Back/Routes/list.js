const express = require('express');
const List = require('../Models/Lists');
const User = require('../Models/Users');
const router = express.Router();
const auth = require('../Middleware/Auth');
const jwt = require("jsonwebtoken");

// Route pour créer une nouvelle liste
router.post('/create', auth, async (req, res) => {
    const { name, content } = req.body;

    if (!name || !content) {
        return res.status(400).json({ message: 'Name and content are required' });
    }

    try {
        // Accédez directement à req.user (décodé par le middleware auth)
        const pseudo = req.user.pseudo;

        // Trouver l'utilisateur par le pseudo
        const user = await User.findOne({ pseudo });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Créer la nouvelle liste
        const newList = new List({
            name,
            content,
            owner: pseudo,
            writters: [],
        });

        // Sauvegarder la nouvelle liste
        await newList.save();
        console.log("Liste créée : ", newList);

        // Réponse avec la liste créée
        res.status(201).json({
            message: 'List created successfully',
            list: newList,
        });
    } catch (err) {
        console.error('Erreur lors de la création de la liste :', err);
        res.status(500).json({ message: 'Error creating the list' });
    }
});

// Route pour récupérer toutes les listes
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

// Route pour récupérer une liste spécifique par ID
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

        // Utilisation de findByIdAndDelete pour supprimer la liste
        await List.findByIdAndDelete(id);

        res.status(200).json({ message: 'List deleted successfully' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la liste :', err);
        res.status(500).json({ message: 'Error deleting the list' });
    }
});

// Route pour mettre à jour une liste par ID
router.put('/update/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;

    try {
        const list = await List.findById(id);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        if (list.owner !== req.user.pseudo) {
            return res.status(403).json({ message: 'You do not have permission to modify this list' });
        }

        // Mise à jour de la liste
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