// queue/order/order.worker.ts

import { Job, Worker } from "bullmq";
import { OrderEventData } from "./order.queue";
import { redisConnection } from "../../db/redis";
import { getOrderWithItems, markOrderFailed } from "../../controllers/orders/order.repository";
import { sendOrderConfirmatinMail } from "../../controllers/email/email.service";
import { clearCartItems, findCartByUserId } from "../../controllers/cart/cart.repository";
import { cache } from "../../utils/cache";

const orderWorker = new Worker<OrderEventData>(
  "order-events-queue",
  async (job: Job<OrderEventData>) => {
    const data = job.data;

    if (data.type === "order.confirmed") {
      const { orderId } = data;

      const { order, items } = await getOrderWithItems(orderId);
      if (!order) return;
      if (order.user_id) {
        const cart = await findCartByUserId(order.user_id);
        if (cart) {
          await clearCartItems(cart.id);
        }

        await cache.delete(`cart:${order.user_id}`);
      }

      setImmediate(() => {
        sendOrderConfirmatinMail(order, items, order.email)
          .catch(err => console.error("[Email] Failed:", err));
      });

      console.log(`✅ Order confirmed side-effects done: ${orderId}`);
    }

    if (data.type === "order.failed") {
      const { orderId } = data;

      await markOrderFailed(orderId);

      console.log(`❌ Order marked failed: ${orderId}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 20,
    limiter: {
      max: 100,
      duration: 1000,
    },
  }
);

// logs
orderWorker.on("completed", (job) => {
  console.log(`[OrderWorker] Job ${job.id} completed`);
});

orderWorker.on("failed", (job, err) => {
  console.error(`[OrderWorker] Job ${job?.id} failed:`, err.message);
});

orderWorker.on("error", (err) => {
  console.error("[OrderWorker] Worker error:", err);
});

export default orderWorker;