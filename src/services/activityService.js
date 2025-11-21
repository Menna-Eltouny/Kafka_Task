//Handles activity logging and retrieval

const Activity = require('../models/Activity');

class ActivityService {
  async saveActivity(activityData) {
    try {
      const activity = new Activity(activityData);
      await activity.save();
      console.log('\nActivity logged:', activity.userId);
      return activity;
    } catch (error) {
      console.error('\nError saving activity:', error);
      throw error;
    }
  }

    async getActivities(page = 1, limit = 10, userId = null) {
        try {
            const query = userId ? { userId } : {};
            const activities = await Activity.find(query)
                .sort({ timestamp: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
            
            return activities;
        } catch (error) {
            console.error('\nError retrieving activities:', error);
            throw error;
        }
    }
}

module.exports = ActivityService;