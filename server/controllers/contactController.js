const nodemailer = require('nodemailer');

exports.handleContactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email service credentials not configured on the server.');
        return res.status(500).json({ error: 'Email service is not configured.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // --- Email to You (The Admin) ---
    const mailToAdmin = {
        from: `"EduConnect Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Message from ${name}: ${subject}`,
        html: `
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">New Website Inquiry</h2>
              </div>
              <div style="padding: 30px;">
                <h3 style="color: #333;">You've received a new message:</h3>
                <div style="margin-bottom: 20px;"><strong style="color: #2980b9;">From:</strong> ${name}</div>
                <div style="margin-bottom: 20px;"><strong style="color: #2980b9;">Email:</strong> <a href="mailto:${email}">${email}</a></div>
                <div style="margin-bottom: 20px;"><strong style="color: #2980b9;">Subject:</strong> ${subject}</div>
                <div style="margin-bottom: 20px;">
                  <strong style="color: #2980b9;">Message:</strong>
                  <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px; background: #f9f9f9; margin-top: 5px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
              </div>
            </div>
          </body>
        `,
    };

    // --- Auto-Reply Email to the User ---
    const mailToUser = {
        from: `"Himank from EduConnect" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `We've received your message | EduConnect ERP`,
        html: `
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #3498db; color: #ffffff; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">EduConnect</h2>
              </div>
              <div style="padding: 30px;">
                <h3 style="color: #333;">Thank You for Your Message, ${name}!</h3>
                <p style="color: #555;">We have received your inquiry and will get back to you soon. Here is a copy of what you sent:</p>
                <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px; background: #f9f9f9; margin-top: 5px;">
                  <p><strong>Subject:</strong> ${subject}</p>
                  <hr style="border: none; border-top: 1px solid #e0e0e0;">
                  <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
                <p style="margin-top: 30px; color: #555;">
                  Best regards,<br>
                  Himank<br>
                  The EduConnect Team
                </p>
              </div>
            </div>
          </body>
        `,
    };

    try {
        await transporter.sendMail(mailToAdmin);
        await transporter.sendMail(mailToUser);
        res.status(200).json({ message: 'Emails sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
};
