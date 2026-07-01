import { NextResponse } from 'next/server';
import menuModel from '@/models/menuModel';
import contactModel from '@/models/contactModel';
import galleryModel from '@/models/galleryModel';
import notificationModel from '@/models/notificationModel';
import activityModel from '@/models/activityModel';

export async function GET() {
  try {
    const [
      menuItemsCount,
      galleryImagesCount,
      todayMessagesCount,
      unreadNotificationsCount,
      recentActivities
    ] = await Promise.all([
      menuModel.countAvailableItems(),
      galleryModel.countGalleryImages({ activeOnly: true }),
      contactModel.countNewMessagesForDate(new Date()),
      notificationModel.countUnreadNotifications(),
      activityModel.getRecentActivities(5)
    ]);

    const formattedActivities = recentActivities.map((activity) => ({
      _id: activity.id?.toString(),
      action: activity.action || 'system',
      entityName: activity.entity_name || 'سیستم',
      entityType: activity.entity_type || 'system',
      createdAt: activity.created_at || new Date()
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          menuItems: menuItemsCount,
          galleryImages: galleryImagesCount,
          todayMessages: todayMessagesCount,
          unreadNotifications: unreadNotificationsCount,
          revenue: 0
        },
        recentActivities: formattedActivities,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);

    return NextResponse.json({
      success: false,
      error: 'خطا در دریافت آمار',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}