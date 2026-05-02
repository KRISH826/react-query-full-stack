// queue/order/order.queue.ts

import { Queue } from "bullmq";
import { redisConnection } from "../../db/redis";

export type OrderEventData =
  | {
      type: "order.confirmed";
      orderId: string;
    }
  | {
      type: "order.failed";
      orderId: string;
    };

export const orderQueue = new Queue<OrderEventData>("order-events-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 1000,
    removeOnFail: 500,
  },
});