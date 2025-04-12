import { Transporter, createTransport } from "nodemailer";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";

const transporter: Transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVICE_USER as string,
    pass: process.env.EMAIL_SERVICE_PASSWORD as string,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendVerificationEmail = async (
  destEmail: string,
  verificationToken: string,
): Promise<void> => {
  const verificationLink = `${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/verify-account?verificationToken=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_SERVICE_USER,
    to: destEmail,
    subject: "FactEcho Account Verification",
    html: `
      <html>

      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: right;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #ffffff;
          }

          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: #fff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }

          .button:hover {
            background-color: #0056b3;
          }

          p {
            font-size: 16px;
            line-height: 1.6;
          }

          .note {
            font-size: 14px;
            color: #555;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <p>مرحبًا،</p>
          <p>يرجى التحقق من حسابك من خلال النقر على الرابط التالي:</p>
          <a href="${verificationLink}" class="button">التحقق من الحساب</a>
          <p class="note">ملاحظة: سينتهي صلاحية هذا الرابط بعد 15 دقيقة.</p>
          <p>إذا لم تطلب ذلك، يرجى تجاهل هذا البريد الإلكتروني.</p>
          <p>شكرًا،</p>
          <p>FactEcho</p>
        </div>
      </body>

      </html>
    `,
  };

  try {
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log("Verification Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
