// cafe-website/src/app/api/db-status/route.js
import { NextResponse } from 'next/server'
import MenuItem from '@/models/menuModel'
import MenuCategory from '@/models/menuCategoryModel'
import ContactMessage from '@/models/contactModel'
import Notification from '@/models/notificationModel'

export async function GET() {
  try {
    await connectToDatabase()
    
    // Get counts from all collections
    const [
      menuItemsCount,
      categoriesCount,
      messagesCount,
      notificationsCount
    ] = await Promise.all([
      MenuItem.countDocuments(),
      MenuCategory.countDocuments(),
      ContactMessage.countDocuments(),
      Notification.countDocuments()
    ])
    
    // Get database info
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()
    
    return NextResponse.json({
      success: true,
      database: 'MongoDB',
      status: 'Connected',
      collections: collections.map(c => c.name),
      statistics: {
        menuItems: menuItemsCount,
        categories: categoriesCount,
        contactMessages: messagesCount,
        notifications: notificationsCount
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      database: 'MongoDB',
      status: 'Disconnected',
      error: error.message,
      help: 'Check if MongoDB is running and MONGODB_URI is correct'
    }, { status: 500 })
  }
}