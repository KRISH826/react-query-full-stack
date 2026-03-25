import { renderTemplate } from "../../helper/emailrender";
import { buildOrderItems } from "../../helper/orderemail";
import { HttpError } from "../../middlewares/error.middleware";
import { OrderDB, OrderItemDB } from "../../models/order";
import { cache } from "../../utils/cache";
import { sendEmail } from "../../utils/ses";
import { getEmailTemplateRepo } from "./email.repository";

const TEMPLATE_CACHE_TTL = 60 * 60 * 24; // 24 hours

export async function getEmailTemplate(name: string): Promise<{ subject: string; html_body: string } | null> {

    return cache.getOrSet(
        `email_template:${name}`,
        () => getEmailTemplateRepo(name),
        TEMPLATE_CACHE_TTL
    );
}

export async function clearEmailTemplateCache(name?: string): Promise<void> {
    if (name) {
        await cache.delete(`email_template:${name}`)
    } else {
        await cache.delPattern(`email_template:*`)
    }
}


export async function sendEmailService(templateName: string, to: string, vars: Record<string, string>) {
    const template = await getEmailTemplate(templateName);
    if (!template) {
        throw new HttpError('email Template is not found', 404);
    }

    await sendEmail(
        to,
        renderTemplate(template.subject, vars),
        renderTemplate(template.html_body, vars)
    )
}

export async function sendOrderConfirmatinMail(order: OrderDB, items: OrderItemDB[], customerName: string) {
    await sendEmailService(
        "order_confirmation",
        order.email,
        {
            customer_name: customerName,
            order_number: order.order_number,
            order_date: order.created_at.toISOString(),
            total_amount: order.total_amount.toString(),
            shipping_address: order.shipping_address,
            city: order.shipping_city,
            postal_code: order.shipping_postal_code,
            country: order.shipping_country,
            state: order.shipping_state,
            items: buildOrderItems(items)
        }
    )
}

export async function sendOrderCancellationMail(order: OrderDB, items: OrderItemDB[], customerName: string) {
    await sendEmailService(
        "order_cancelled",
        order.email,
        {
            customer_name: customerName,
            order_number: order.order_number,
            items: buildOrderItems(items),
            total_amount: order.total_amount.toString(),
        }
    )
}

export async function sendOrderItemsCancellationMail(order: OrderDB, items: OrderItemDB[], customerName: string) {
    const cancelledTotal = items
        .reduce((sum, item) => sum + Number(item.subtotal), 0)
        .toFixed(2);
    await sendEmailService(
        "order_items_cancelled",
        order.email,
        {
            customer_name: customerName,
            order_number: order.order_number,
            items: buildOrderItems(items),
            total_amount: cancelledTotal,
        }
    )
}