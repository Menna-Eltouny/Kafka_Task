# Activity Logs Proccessing System

This project demonstrate a pipeline for processing **user activity logs** using **Kafka (Kraft mode)**, **Node.js**, and **MongoDB**

## Features

### Kafka Producer
- Generates user activity logs.
- Sends logs to Kafka topic.

### Kafka Consumer
- Listens to the Kafka topic.
- Processes incoming logs.
- Saves documents to MongoDB

### MongoDB Integration
- stores all activity logs.
- Automatically creates index {userId: 1, timestamp:-1, action:1}

### Dockarized Deployment
- Kafka (KRaft Mode)
- MongoDB
- Node.js app (Producer + Consumer)

## Project Structure
user-activity-service/
├── 📁 src/
│   ├── 📄 index.js                 # Main application entry point
│   ├── 📁 models/
│   │   └── 📄 Activity.js          # MongoDB schema and model
│   ├── 📁 services/
│   │   ├── 📄 kafkaService.js      # Kafka producer/consumer service
│   │   └── 📄 activityService.js   # Business logic for activities
│   ├── 📁 controllers/
│   │   └── 📄 activityController.js # HTTP request handlers
│   └── 📄 routes.js                # Express route definitions
├── 📄 docker-compose.yml           # Docker orchestration
├── 📄 Dockerfile                   # Container configuration
├── 📄 .env                         # Environment variables
├── 📄 .env.example                 # Environment template
├── 📄 package.json                 # Dependencies and scripts
└── 📄 README.md                    # Documentation

## Running the System
### 1. clone the repository
``` bash
git clone https://github.com/Menna-Eltouny/Kafka_Task.git
cd Kafka_Task

docker-compose up
```

## Technologies Used
- Kafka
- Node.js and Express
- MongoDB
- Docker & Docker-compose
