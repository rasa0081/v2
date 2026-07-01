// src/utils/activityLogger.js - MySQL Version
import activityModel from '@/models/activityModel';

/**
 * Log an activity to the database
 * @param {Object} params - Activity parameters
 * @param {string} params.action - Action type (create, update, delete, etc.)
 * @param {string} params.entityType - Type of entity (menu_item, category, etc.)
 * @param {string} params.entityName - Name of the entity
 * @param {string} [params.userId] - User ID (defaults to 'admin')
 * @param {number} [params.entityId] - Entity ID
 * @param {Object} [params.details] - Additional details
 * @param {Request} [params.request] - Next.js request object for IP/userAgent
 */
export async function logActivity({
  action,
  entityType,
  entityName,
  userId = 'admin',
  entityId = null,
  details = {},
  request = null
}) {
  try {
    const activityData = {
      userId,
      action,
      entityType,
      entityName,
      entityId,
      details
    };

    // Add IP and userAgent if request is provided
    if (request) {
      const ip = request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 '127.0.0.1';
      const userAgent = request.headers.get('user-agent') || 'Unknown';

      activityData.ipAddress = ip.split(',')[0].trim();
      activityData.userAgent = userAgent;
    }

    await activityModel.logActivity(activityData);

    console.log(`✅ Activity logged: ${action} ${entityType} "${entityName}"`);

  } catch (error) {
    console.error('❌ Error logging activity:', error);
    // Don't throw error - activities are important but shouldn't break the app
  }
}

/**
 * Get recent activities
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Array of activities
 */
export async function getRecentActivities(limit = 10) {
  try {
    return await activityModel.getRecentActivities(limit);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

export default {
  logActivity,
  getRecentActivities
};
