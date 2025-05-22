const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/' , (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
    });
});

module.exports = router;