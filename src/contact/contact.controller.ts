import { Request, Response } from "express";
import { ContactModel } from "./contact.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Transporter configuration
const transporterConfig: any = {
  host: process.env.SMTP_HOST || "smtp.zoho.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Optimization for Gmail
if (process.env.SMTP_HOST?.includes("gmail.com")) {
  delete transporterConfig.host;
  delete transporterConfig.port;
  delete transporterConfig.secure;
  transporterConfig.service = "gmail";
}

const transporter = nodemailer.createTransport(transporterConfig);

// Diagnostic log (Masked)
console.log("SMTP Config initialized for:", process.env.SMTP_USER);
if (!process.env.SMTP_PASS) {
  console.error("❌ WARNING: SMTP_PASS is missing in .env!");
}

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { type, fullName, email, inquiryType, topic, priority, message } =
      req.body;

    // Generate Ticket ID for support
    let ticketId = "";
    if (type === "support") {
      ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Handle file attachment name if provided by multer
    const attachmentName = req.file ? req.file.filename : undefined;

    // 1. Save to MongoDB
    const newContact = await ContactModel.create({
      type,
      fullName,
      email,
      inquiryType,
      topic,
      priority,
      message,
      attachmentName,
      ticketId,
    });

    // 2. Prepare Feedback Email
    const isSupport = type === "support";
    const subject = isSupport
      ? `[Support] Ticket ${ticketId} - Confirmation`
      : `Confirmation: We received your inquiry`;

    const plainText = `
      Hello ${fullName},
      
      ${
        isSupport
          ? `Your support ticket (${ticketId}) has been registered. Our team is reviewing it.`
          : `Thank you for your inquiry! Our sales team will contact you within 24 hours.`
      }
      
      Best regards,
      The NextComponents Team
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #4f46e5; margin-bottom: 24px; font-size: 24px; font-weight: 700;">
            ${isSupport ? "Ticket Received" : "We've got your message"}
          </h2>
          
          <p style="font-size: 16px; margin-bottom: 24px;">Hello <strong>${fullName}</strong>,</p>
          
          <p style="font-size: 16px; margin-bottom: 24px;">
            ${
              isSupport
                ? `Your support ticket has been successfully registered. Our technical team is reviewing the details and will get back to you shortly.`
                : `Thanks for reaching out! Our team has received your inquiry regarding <strong>${inquiryType}</strong> and will contact you within 24 hours.`
            }
          </p>
          
          ${
            isSupport
              ? `
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Reference Number</p>
            <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 20px; font-weight: bold; font-family: monospace;">${ticketId}</p>
          </div>`
              : ""
          }

          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px; font-size: 14px; color: #94a3b8;">
            <p style="margin: 0;">Best regards,<br><strong style="color: #475569;">NextComponents Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Attempt to send email
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || `"Support" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        text: plainText, // Adding text version significantly improves spam score
        html: htmlContent,
      });
      console.log(`Email sent successfully to ${email}`);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    // 3. Send Admin Notification Email
    const adminHtmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #4f46e5;">New ${type.toUpperCase()} Submission</h2>
        <p><strong>From:</strong> ${fullName} (${email})</p>
        <p><strong>Type:</strong> ${type}</p>
        ${
          isSupport
            ? `<p><strong>Topic:</strong> ${topic}</p><p><strong>Priority:</strong> ${priority}</p><p><strong>Ticket ID:</strong> ${ticketId}</p>`
            : `<p><strong>Inquiry Type:</strong> ${inquiryType}</p>`
        }
        <p><strong>Message:</strong></p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 5px; border: 1px solid #e2e8f0;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        ${
          attachmentName
            ? `<p><strong>Attachment:</strong> Saved as ${attachmentName}</p>`
            : ""
        }
      </div>
    `;

    try {
      await transporter.sendMail({
        from:
          process.env.MAIL_FROM || `"System Alert" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Send to your own Gmail
        subject: `New ${type.toUpperCase()}: ${fullName}`,
        html: adminHtmlContent,
      });
      console.log(`Admin notification sent successfully`);
    } catch (adminError) {
      console.error("Admin notification failed:", adminError);
    }

    res.status(201).json({
      message: "Submission successful",
      ticketId: ticketId,
      data: newContact,
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
