

export const forgetPassEmailTemplate = (name, link) => {
    return {
        subject: "Reset Your Password",
        html: `
         <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0; font-weight: 600; color: #2563eb; font-size: 24px;">Reset Password</h2>
  </div>

  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
    Hello <span style="font-weight: 500; color: #111;">${name || "User"}</span>,
  </p>
  
  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
    To reset your password, please click the button below. This link is valid for 10 minutes only.
  </p>
  
  <div style="text-align: center; margin: 35px 0;">
    <a href="${link}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 500; font-size: 16px; transition: background-color 0.2s ease; box-shadow: 0 2px 5px rgba(37, 99, 235, 0.2);">Reset Password</a>
  </div>
  
  <div style="margin: 30px 0; padding: 15px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 4px;">
    <p style="font-size: 14px; line-height: 1.6; color: #555; margin: 0;">
     <strong style="color: #0f172a;">Time Limit:</strong>This link will expire in 10 minutes for security reasons.
    </p>
  </div>
  
  <p style="font-size: 14px; line-height: 1.6; color: #555; margin-bottom: 20px;">
     If you didn't request a password reset, you can safely ignore this email. Your account security is important to us, and your password will remain unchanged.
  </p>
  
  <p style="font-size: 14px; line-height: 1.6; color: #555;">
    Thank you,<br>
    <span style="font-weight: 500; color: #333;">The My App Team</span>
  </p>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <div style="text-align: center;">
    <p style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">
      This is an automated message. Please do not reply to this email.
    </p>
    <p style="font-size: 12px; color: #6b7280; margin: 0;">
      © 2025 My App. All rights reserved.
    </p>
  </div>
</div>
    `
    };
};