import { Worker } from "bullmq";
import { redisConnection } from "../../db/redis";
import { getOrderWithItems, markOrderFailed } from "../../controllers/orders/order.repository";
import { sendOrderConfirmatinMail } from "../../controllers/email/email.service";
import { clearCartItems, findCartByUserId } from "../../controllers/cart/cart.repository";
import { cache } from "../../utils/cache";

new Worker(
  "order-events-queue",
  async (job) => {
    const data = job.data;

    if (data.type === "order.confirmed") {
      const { orderId } = data;

      const { order, items } = await getOrderWithItems(orderId);
      if (!order) return;

      if (order.user_id) {
        const cart = await findCartByUserId(order.user_id);
        if (cart) await clearCartItems(cart.id);

        await cache.delete(`cart:${order.user_id}`);
      }

      setImmediate(() => {
        sendOrderConfirmatinMail(order, items, order.email);
      });
    }

    if (data.type === "order.failed") {
      await markOrderFailed(data.orderId);
    }
  },
  { connection: redisConnection }
);