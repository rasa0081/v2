import { NextResponse } from 'next/server';
import notificationModel from '@/models/notificationModel';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const notifications = await notificationModel.getAllNotifications({
      type,
      page,
      limit
    });

    const total = await notificationModel.countNotifications({ unread: true });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        total,
        unreadCount: total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت اطلاعیه‌ها' },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'شناسه اطلاعیه الزامی است' },
        { status: 400 }
      );
    }

    const notification = await notificationModel.markAsRead(data.id);

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'اطلاعیه یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'اطلاعیه به عنوان خوانده شده علامت‌گذاری شد'
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در به‌روزرسانی اطلاعیه' },
      { status: 500 }
    );
  }
}

// Mark all as read
export async function POST(request) {
  try {
    await notificationModel.markAllAsRead();

    return NextResponse.json({
      success: true,
      message: 'تمامی اطلاعیه‌ها به عنوان خوانده شده علامت‌گذاری شدند'
    });

  } catch (error) {
    console.error('Error marking all as read:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در به‌روزرسانی اطلاعیه‌ها' },
      { status: 500 }
    );
  }
}

// Delete notification
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'شناسه اطلاعیه الزامی است' },
        { status: 400 }
      );
    }

    const result = await notificationModel.deleteNotification(id);

    if (result === 0) {
      return NextResponse.json(
        { success: false, error: 'اطلاعیه یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'اطلاعیه با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در حذف اطلاعیه' },
      { status: 500 }
    );
  }
}
