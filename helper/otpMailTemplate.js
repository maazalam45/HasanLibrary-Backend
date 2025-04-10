

export const otpEmailTemplate = (otp, name, isResend = false) => {
  return {
    subject: isResend ? "Resend OTP to Verify Your Email Address" : "Verify Your Email Address",
    html: `
         <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 3px 12px rgba(0,0,0,0.06); color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0; font-weight: 600; color: #3b82f6; font-size: 24px;">Verify Your Email Address</h2>
  </div>

  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
    Hello <span style="font-weight: 500; color: #111;">${name || "User"}</span>,
  </p>
  
  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
    ${isResend ? "Here is your new verification code. This code is valid for the next 10 minutes." : "To complete your sign-up process, please use the verification code below. This code is valid for the next 10 minutes."}
  </p>
  
  <div style="margin: 35px 0; padding: 20px; background: linear-gradient(to right, #f8fafc, #eff6ff); text-align: center; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
    <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e3a8a; font-family: 'Courier New', monospace;">${otp}</div>
    <p style="font-size: 13px; color: #64748b; margin-top: 8px; margin-bottom: 0;">Please enter this code to verify your email</p>
  </div>
  
  <div style="margin: 30px 0; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0;">
      <strong style="color: #0f172a;">Time Limit:</strong> This code is valid for the next 10 minutes.
    </p>
  </div>
  
  <p style="font-size: 14px; line-height: 1.6; color: #555; margin-bottom: 20px;">
    If you did not request this verification code, you can safely ignore this email.Your account security is important to us.
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