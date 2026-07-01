import { NextResponse } from 'next/server';
import MenuItem from '@/models/menuModel';
import ContactMessage from '@/models/contactModel';
import GalleryImage from '@/models/galleryModel';
import Notification from '@/models/notificationModel';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all counts in parallel for better performance
    const [
      menuItemsCount,
      galleryImagesCount,
      todayMessagesCount,
      unreadNotificationsCount
    ] = await Promise.all([
      MenuItem.countDocuments({ available: true }),
      GalleryImage.countDocuments({ isActive: true }),
      ContactMessage.countDocuments({ 
        createdAt: { $gte: today },
        status: 'new'
      }),
      Notification.countDocuments({ read: false })
    ]);
    
    // Get recent notifications as activities
    const recentNotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // Format recent activities from notifications
    const recentActivities = recentNotifications.map(notification => ({
      _id: notification._id,
      action: notification.type === 'contact' ? 'contact' : 'system',
      entityName: notification.title,
      entityType: notification.type,
      createdAt: notification.createdAt
    }));
    
    // Calculate revenue (placeholder - you'll need an Order model)
    const revenue = 320; // Placeholder
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          menuItems: menuItemsCount,
          galleryImages: galleryImagesCount,
          todayMessages: todayMessagesCount,
          unreadNotifications: unreadNotificationsCount,
          revenue: revenue
        },
        recentActivities,
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