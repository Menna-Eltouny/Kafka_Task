// Handles activity-related HTTP requests

const activityService = require('../services/activityService');
const kafkaService = require('../services/kafkaService');

class ActivityController {
    // Handles POST HTTP
    async createActivity(req, res) {
        try {
            const { userId, action, resource } = req.body;

            if(!userId || !action || !resource) {
                return res.status(404).json({
                    error: 'Missing required fields: userId, action, resource'
                });
            }

            const activityData = {
                userId,
                action,
                resource,
                timestamp: new Date()
            };

            console.log('\nRecieved activity',userId)
            await activityService.saveActivity(activityData);
            console.log('\nSaved activity to Mongo',userId);
            
            try {
                if (!kafkaService.isConnected) {
                    await kafkaService.produceActivity(activityData);
                    console.log('\nProduced activity to Kafka',userId);
                }
            } catch (kafkaError) {
                console.error('\nKafka produce error but saved:', kafkaError.message);
            }

            
            
            res.status(202).json({
                success: true,
                message: 'Activity is being processed',
                data: activityData
                
            });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to create activity',
                details: error.message
            });
        }
    }
    // Handles GET HTTP
    async getActivities(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const userId = req.query.userId || null;
            
            const result = await activityService.getActivitiesByUser(page, limit, userId);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                error: '\nFailed to retrieve activities',
                messages: error.message
            });
        }
    }
}

module.exports = ActivityController;