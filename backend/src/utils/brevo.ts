import { BrevoClient } from "@getbrevo/brevo";
import { config } from "../config/config";

const brevo = new BrevoClient({ apiKey: config.brevo.api_key! })

export const sendEmail = async (to: string | string[],
    subject: string,
    html: string): Promise<void> => {
    const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({ email }));

    await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            email: config.brevo.email_form,
            name: config.brevo.sender,
        },
        to: recipients,
        subject,
        htmlContent: html,
    });

    console.log("[Brevo] Email sent successfully to:", to);
}