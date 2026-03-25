const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });


// https://documentation.mailgun.com/docs/mailgun/sdk/nodejs_sdk

class MailgunClient {
    static async sendEmail(email, subject, text) {
        try {
            const data = await mg.messages.create("sandboxae7d646ff7dc49828f3bef83f839e48f.mailgun.org", {
                from: "Mailgun Sandbox <postmaster@sandboxae7d646ff7dc49828f3bef83f839e48f.mailgun.org>",
                to: [email],
                subject: subject,
                text: text,
            });

            console.log(data); // logs response data
        } catch (error) {
            console.log(error); //logs any error
        }
    }
}

module.exports = MailgunClient;