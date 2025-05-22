const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const statusRoutes = require('./routes/status');
const itemRoutes = require('./routes/items');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;

app.use(express.json());

const logDirectory = '/var/logs';
const devLogDirectory = path.join(__dirname, 'logs');
const logFileName = 'api_access.log';

const currentLogDirectory = process.env.NODE_ENV === 'production' ? logDirectory : devLogDirectory;
const logFilePath = path.join(currentLogDirectory, logFileName);

if (!fs.existsSync(currentLogDirectory)) {
    try {
        fs.mkdirSync(currentLogDirectory, { recursive: true });
        console.log(`Log directory created: ${currentLogDirectory}`);
    } catch (err) {
        console.error(`Error creating log directory ${currentLogDirectory}:`, err);
    }
}

// Logger ruter som blir kalt og tidspunktet i formatet dd.mm.yyyy - /url
app.use((req, res, next) => {
    console.log('--- DEBUG: Log middleware CALLED ---');
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const timestamp = `${day}.${month}.${year}`;
    const logMessage = `${timestamp} - ${req.method} ${req.originalUrl}\n`;

    console.log(`DEBUG: Attempting to log to: ${logFilePath}`);
    console.log(`DEBUG: Log message: ${logMessage.trim()}`);

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('DEBUG: Failed to write to log file:', err);
            console.error('DEBUG: Error object:', JSON.stringify(err, null, 2));
        } else {
            console.log(`DEBUG: Successfully wrote to log file: ${logFilePath}`);
        }
    });
    next();
});

app.use('/status', statusRoutes);
app.use('/items', itemRoutes);

// Enkel feilhåndtering
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Noe gikk galt!');
});

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });