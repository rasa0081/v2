// cafe-website/src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import contactModel from '@/models/contactModel';
import notificationModel from '@/models/notificationModel';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { success: false, error: 'تمامی فیلدهای الزامی را پر کنید' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'ایمیل معتبر نیست' },
        { status: 400 }
      );
    }

    // Save to database
    const newMessageId = await contactModel.createContactMessage({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: 'new',
      read: false
    });

    // Get the created message
    const contactMessage = await contactModel.getContactMessageById(newMessageId);

    // Create notification for admin
    await notificationModel.createNotification({
      type: 'contact',
      title: 'پیام جدید از فرم تماس',
      message: `${data.firstName} ${data.lastName}: ${data.subject}`,
      data: {
        messageId: contactMessage.id,
        email: data.email,
        subject: data.subject
      },
      priority: 'high'
    });

    // Log activity
    try {
      const activityModel = (await import('@/models/activityModel')).default;
      await activityModel.logActivity({
        action: 'create',
        entityType: 'contact_message',
        entityName: `${data.firstName} ${data.lastName}`,
        entityId: contactMessage.id,
        userId: 'visitor',
        details: { subject: data.subject }
      });
    } catch (logError) {
      console.log('Failed to log activity:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.',
      data: {
        id: contactMessage.id,
        timestamp: contactMessage.created_at
      }
    });

  } catch (error) {
    console.error('Error processing contact form:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'خطا در ارسال پیام. لطفا بعدا مجدداً تلاش کنید.'
      },
      { status: 500 }
    );
  }
}

// GET - Get contact messages (for admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const messages = await contactModel.getAllContactMessages({
      status: status || 'all',
      limit,
      page
    });

    const total = await contactModel.countContactMessages({ status: status || undefined });

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت پیام‌ها' },
      { status: 500 }
    );
  }
}
