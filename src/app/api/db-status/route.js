import { NextResponse } from 'next/server';
import { testConnection, query } from '@/lib/mysql';
import menuModel from '@/models/menuModel';
import menuCategoryModel from '@/models/menuCategoryModel';
import contactModel from '@/models/contactModel';
import notificationModel from '@/models/notificationModel';

export async function GET() {
  try {
    const connected = await testConnection();

    if (!connected) {
      return NextResponse.json({
        success: false,
        database: 'MySQL',
        status: 'Disconnected',
        error: 'Could not connect to MySQL',
        help: 'Check if MySQL is running and .env.local credentials are correct'
      }, { status: 500 });
    }

    const [tablesResult, menuItemsCount, categoriesCount, messagesCount, notificationsCount] =
      await Promise.all([
        query('SHOW TABLES'),
        menuModel.countAvailableItems(),
        menuCategoryModel.countActiveCategories(),
        contactModel.countContactMessages(),
        notificationModel.countUnreadNotifications()
      ]);

    return NextResponse.json({
      success: true,
      database: 'MySQL',
      status: 'Connected',
      tables: tablesResult.map((row) => Object.values(row)[0]),
      statistics: {
        menuItems: menuItemsCount,
        categories: categoriesCount,
        contactMessages: messagesCount,
        notifications: notificationsCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      database: 'MySQL',
      status: 'Disconnected',
      error: error.message,
      help: 'Check if MySQL is running and MYSQL_* values in .env.local are correct'
    }, { status: 500 });
  }
}