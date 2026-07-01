// src/app/api/admin/orders/stream/route.js — SSE for real-time order updates
import orderModel from '@/models/orderModel';

export const dynamic = 'force-dynamic';

export async function GET() {
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

          // Send update if order count changed or first load
          const currentCount = stats.total;
          if (lastOrderCount === null || currentCount !== lastOrderCount) {
            lastOrderCount = currentCount;
            sendEvent({ type: 'orders_update', stats, orders });
          } else {
            // Still send a heartbeat with stats
            sendEvent({ type: 'heartbeat', stats });
          }
        } catch (error) {
          console.error('SSE poll error:', error.message);
          sendEvent({ type: 'error', message: 'خطا در دریافت اطلاعات' });
        }
      };

      // Initial data
      await poll();

      // Poll every 3 seconds
      const interval = setInterval(poll, 3000);

      // Cleanup when client disconnects
      const cleanup = () => {
        clearInterval(interval);
        try { controller.close(); } catch {}
      };

      // Auto-close after 5 minutes to prevent resource leaks
      setTimeout(cleanup, 5 * 60 * 1000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}