import nodemailer from "nodemailer";

function createTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: 'OAuth2',
            user: process.env.GOOGLE_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        }
    });
}

export async function sendEmail({ to, subject, html, text }) {
    const transporter = createTransporter();
    const details = await transporter.sendMail({
        from: process.env.GOOGLE_USER,
        to: to,
        subject: subject,
        html: html,
        text: text
    });

    return details; // ✅ Sirf return — res bilkul nahi
}