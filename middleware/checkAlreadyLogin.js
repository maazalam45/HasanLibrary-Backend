export const checkAlreadyLoggedIn = (req, res, next) => {
    const token = req.cookies?.token;
    if (token) {
        return res.status(400).json({ message: "You are already logged in" });
    }
    next();
};
