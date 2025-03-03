// import { Resend } from 'resend';
const { Resend } = require('resend');
const dotenv = require('dotenv')
dotenv.config()

if(!process.env.RESEND_API){
    console.log("Provide RESEND_API in side the .env file")

}
const resend = new Resend(process.env.RESEND_API);
console.log('resend', resend);

const sendEmail = async({sendTo, subject, html })=>{
    console.log('resend', resend);

    try {
        // sendTo
        const { data, error } = await resend.emails.send({
            from: 'Binkeyit <noreply@resend.dev>',
            to: 'younesdakka78@gmail.com',
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
            // return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

// export default sendEmail
module.exports = sendEmail