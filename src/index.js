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

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await kafkaService.connect();
        setTimeout(() => {
        processKafkaMessages();
        }, 15000);
        app.listen(PORT, () => {
            console.log(`\nServer is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('\nFailed to start server:', error);
        process.exit(1);
    }
}

startServer();