import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_TEMPLATE } from './templates';


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    },
});

export const sendWelcomeEmail =async({email,name,intro}:WelcomeEmailData)=>{
        const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}',name)
        .replace('{{intro}}',intro);

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL!,
            to: email,
            subject: 'Welcome to Sphere - Your Journey to Smart Investing Starts Here!',
            text: `Hi ${name},\n\n${intro}\n\nWe're thrilled to have you on board! Explore our platform to start your investment journey.\n\nBest regards,\nThe Sphere Team`,
            html: htmlTemplate,
        };

        await transporter.sendMail(mailOptions);

}