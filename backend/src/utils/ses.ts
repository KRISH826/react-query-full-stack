import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { config } from "../config/config"

export const sesClient = new SESClient({
    region: config.s3.region,
    credentials: {
        accessKeyId: config.ses.access_key!,
        secretAccessKey: config.ses.secret_key!
    }
})

export const sendEmail = async (
    to: string | string[],
    subject: string,
    html: string
): Promise<void> => {
    const command = new SendEmailCommand({
        Source: config.ses.email_from,
        Destination: {
            ToAddresses: Array.isArray(to) ? to : [to]
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: "UTF-8"
            },
            Body: {
                Html: {
                    Data: html,
                    Charset: "UTF-8"
                }
            }
        }
    })

    await sesClient.send(command);
    console.log("[SES] Email sent successfully to:", to);
}