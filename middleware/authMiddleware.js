import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (decoded.tokenVersion !== req.user.tokenVersion) {
            return res.status(401).json({ message: "Session expired, please login again" });
        }


        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};
