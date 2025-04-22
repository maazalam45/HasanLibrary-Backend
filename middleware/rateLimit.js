import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many registration attempts. Try again after an hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many login attempts. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const resendOtpLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    message: {
        message: "Too many OTP resend requests. Please wait a minute.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const verifyOtpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many verification attempts. Please wait 5 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const forgetPassLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        message: "Too many forgot password requests. Try again after an hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
