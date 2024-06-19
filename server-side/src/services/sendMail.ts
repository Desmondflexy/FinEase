import nodemailer from 'nodemailer';

export default function (to: string, subject: string, text: string) {
    const user = process.env.GMAIL;
    const pass = process.env.GMAIL_PASSWORD;
    const host = process.env.GMAIL_HOST;
    const port = Number(process.env.GMAIL_PORT);

    const transporter = nodemailer.createTransport({ host, port, secure: true, auth: { user, pass } });
    const mailOptions = { from: user, to, subject, html: text };

    let result = false;
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error.message);
        } else {
            result = true;
            console.log("Email sent: " + info.response);
        }
    });

    return result;
}

export const getPasswordResetHTML = (name: string, resetLink: string) => `
    <div style="font-family: Arial, Helvetica, sans-serif;">
        <header>
            <h1 style="color:rgb(64, 81, 60);">Finease</h1>
        </header>
        <main style="border-top: 1px solid rgb(218, 216, 216); border-bottom: 1px solid rgb(218, 216, 216);">
            <p>Hello ${name},</p>
            <p>To reset your Finease account password, please click the link below:</p>
            <a href="${resetLink}">
                <button style="cursor: pointer; padding: 10px; margin: 20px 0; width: 150px; border-radius: 10px;">Reset Password</button>
            </a>

            <p>This link expires in 10 minutes.</p>
        </main>
        <footer style="color:rgb(81, 60, 60)">
            <p>© Finease. All Rights Reserved</p>
        </footer>
    </div>
`

export const getEmailVerifyHTML = (name: string, verifyLink: string) => `
    <div style="font-family: Arial, Helvetica, sans-serif;">
        <header>
            <h1 style="color:rgb(64, 81, 60);">Finease - Email Verification</h1>
        </header>
        <main style="border-top: 1px solid rgb(218, 216, 216); border-bottom: 1px solid rgb(218, 216, 216);">
            <p>Hello ${name},</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verifyLink}">
                <button style="cursor: pointer; padding: 10px; margin: 20px 0; width: 150px; border-radius: 10px;">Verify Email</button>
            </a>
        </main>
        <footer style="color:rgb(81, 60, 60)">
            <p>© Finease. All Rights Reserved</p>
        </footer>
    </div>
`

// const message = `
// Click the button to verify your email address\n\n
// <a href="${baseUrl}/auth/email-verify/${token.id}">${buttonMessage}</a>
// `;