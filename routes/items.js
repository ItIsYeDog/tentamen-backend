const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: "Error fetching items from database" });
    }
});

// POST /items
router.post('/', async (req, res) => {
    try {
        const newItemData = req.body;
        const newItem = new Item(newItemData);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error inserting item:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message, errors: err.errors });
        }
        res.status(500).json({ message: "Error inserting item into database" });
    }
});

// DELETE /items/:id
router.delete('/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const result = await Item.findByIdAndDelete(itemId);

        if (result) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (err) {
        console.error('Error deleting item:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid item ID format" });
        }
        res.status(500).json({ message: "Error deleting item from database" });
    }
});

module.exports = router;