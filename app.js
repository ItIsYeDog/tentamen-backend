const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const statusRoutes = require('./routes/status');
const itemRoutes = require('./routes/items');

dotenv.config();

const app = express();
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;

app.use(express.json());

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

app.use('/status', statusRoutes);
app.use('/items', itemRoutes);


// Enkel feilhåndtering
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Noe gikk galt!');
});

