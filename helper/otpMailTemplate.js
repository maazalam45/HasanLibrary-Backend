

export const otpEmailTemplate = (otp, name, isResend = false) => {
  return {
    subject: isResend ? "Resend OTP to Verify Your Email Address" : "Verify Your Email Address",
    html: `
         <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
            <h2 style="margin-bottom: 20px; font-weight: 500; color: #111;">Verify your email address</h2>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Hello ${name || "User"},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
            ${isResend ? "Here is your new verification code. This code is valid for the next 10 minutes." : "To complete your sign- up process, please use the verification code below.This code is valid for the next 10 minutes."}
              
            </p>
            
            <div style="margin: 30px 0; padding: 15px; background-color: #f8f8f8; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #222;">
              ${otp}
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; color: #555;">
              If you did not request this, you can safely ignore this email.
            </p>
            
            <p style="font-size: 14px; line-height: 1.6; color: #555;">
              Thank you,<br>
              The My App Team
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              This is an automated message.
            </p>
          </div>
    `
  };
};