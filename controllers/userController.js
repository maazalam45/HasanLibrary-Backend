import { User } from "../models/User.js";

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name || user.name;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteMyAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "None"
        });

        res.status(200).json({ message: "Your account has been deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};