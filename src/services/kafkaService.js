const { Kafka } = require('kafkajs');

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'user-activity-service',
      brokers: process.env.KAFKA_BROKERS.split(','),
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'activity-group' });

    this.isConnected = false;
  }
    async connect() {
        try {
            await this.producer.connect();
            await this.consumer.connect();
            console.log('\nCONNECTED TO KAFKA SUCCESSFULLY');

            await new Promise(resolve => setTimeout(resolve, 2000));
            this.isConnected = true;

        } catch (error) {
            console.error('\nKAFKA CONNECTION FAILED:', error.message);
            throw error;
        }
    }
    
  async produceActivity(activity) {
    if(!this.isConnected) {
      throw new Error('\nKafka producer is not connected');
    }
    try {
      await this.producer.send({
        topic: 'user-activities',
        messages: [
          { value: JSON.stringify(activity) }
        ],
      });
      console.log('\nActivity sent to Kafka:', activity.userId);
    } catch (error) {
      console.error('\nFailed to send activity to Kafka:', error.message);
    }
  }

    async consumeActivities(callback) {
      if(!this.isConnected) {
          throw new Error('\nKafka consumer is not connected');
      }

      try{

          await new Promise(resolve => setTimeout(resolve, 3000));

          await this.consumer.subscribe({ 
              topic: 'user-activities', 
              fromBeginning: false 
          });

          console.log('\nKafka consumer subscribed to topic: user-activities');

          await this.consumer.run({
              eachMessage: async ({ message }) => {
                  try {
                      const activity = JSON.parse(message.value.toString());
                      console.log('\nActivity received from Kafka:', activity.userId);
                      await callback(activity);
                  } catch (error) {
                      console.error('\nFailed to process activity from Kafka:', error.message);
                  }
              },
          });

          console.log('\nKafka consumer is running and processing messages');

      } catch (error) {
          console.error('\nFailed to consume activities from Kafka:', error.message);
          throw error;
      }
  }
}

module.exports = KafkaService;