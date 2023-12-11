const axios = require('axios');
const { DateTime } = require('luxon'); // For date/time manipulation

module.exports = {
    /**
     * Simple example.
     * Every monday at 1am.
     */
    // 0 0 * * 0
    "0 0 * * 0": async ({ strapi }) => {
      try {
        // Calculate the date one week ago
        const oneWeekAgo = DateTime.local().minus({ weeks: 1 }).toJSDate();
    
        // Delete notifications older than one week
       let notification= await strapi.db.query('api::notification.notification').deleteMany({ createdAt: { $lt: oneWeekAgo } });
    
        console.log('Old notifications deleted successfully.',notification);
      } catch (error) {
        console.error('Error deleting old notifications:', error);
      }
  }
  }