import jwt from 'jsonwebtoken';
import orderModel from '@/models/orderModel';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'caribou-cafe-jwt-secret-2024';

function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('adminToken')?.value;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : cookieToken;

    if (!token) return false;

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET(request) {
  if (!verifyAdmin(request)) {
    return new Response(
      JSON.stringify({ success: false, error: 'دسترسی غیرمجاز' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastOrderCount = null;

      const sendEvent = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const poll = async () => {
        try {
          const stats = await orderModel.getOrderStats();
          const orders = await orderModel.getAllOrders({ limit: 20 });
          const currentCount = stats.total;

          if (lastOrderCount === null || currentCount !== lastOrderCount) {
            lastOrderCount = currentCount;
            sendEvent({ type: 'orders_update', stats, orders });
          } else {
            sendEvent({ type: 'heartbeat', stats });
          }
        } catch (error) {
          console.error('SSE poll error:', error.message);
          sendEvent({ type: 'error', message: 'خطا در دریافت اطلاعات' });
        }
      };

      await poll();
      const interval = setInterval(poll, 3000);

      setTimeout(() => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      }, 5 * 60 * 1000);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
}