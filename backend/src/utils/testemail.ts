import { sendEmail } from "./ses"

const testMail = async () => {
    try {
        await sendEmail(
            "krishnendupanja98@gmail.com", // apna email dalo
            "🎉 SES Test Email",
            `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #4CAF50;">Amazon SES Working! 🚀</h1>
                <p>Hello Krishnendu!</p>
                <p>Tera Amazon SES setup successfully ho gaya hai!</p>
                <ul>
                    <li>✅ Domain Verified</li>
                    <li>✅ DKIM Configured</li>
                    <li>✅ SPF Configured</li>
                    <li>✅ DMARC Configured</li>
                </ul>
                <p style="color: #888;">Sent from ecommerceapi.krishnendupanja.online</p>
            </div>
            `
        )
        console.log("✅ Email successfully bheja gaya!")
    } catch (error) {
        console.error("❌ Error:", error)
    }
}

testMail()