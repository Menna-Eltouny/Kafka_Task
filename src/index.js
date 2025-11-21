// src/index.js
// Entry point for the Express server, MongoDB connection, and Kafka integration

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');
const KafkaService = require('./services/kafkaService');
const ActivityService = require('./services/activityService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

const kafkaService = new KafkaService();
const activityService = new ActivityService();

// Process messages from Kafka and save to MongoDB
async function processKafkaMessages() {
    try{
        await kafkaService.consumeActivities(async (activity) => {
            try {
                await activityService.saveActivity(activity);
            } catch (error) {
                console.error('\nError processing activity from Kafka:', error);
            }
        });
} catch (error) {
    console.error('\nFailed to start consuming Kafka messages:', error);
    }
}

// Start the server after connecting to MongoDB and Kafka
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await kafkaService.connect();
        console.log('Kafka Producer connected');

        setTimeout(async () => {
            try {
                await processKafkaMessages();
                console.log('\nStarted consuming Kafka messages');

            } catch (error) {
                console.error('\nError consuming Kafka message processing:');
            }
        }, 5000);

        app.listen(PORT, () => {
            console.log(`\nServer is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('\nFailed to start server:', error);
        process.exit(1);
    }
}

startServer();