import { User } from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { email, name, role } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        };

        user.email = email || user.email;
        user.name = name || user.name;
        user.role = role || user.role;

        const updatedUser = await user.save();

        res.json({
            message: "User updated successfully, Here's below you can see updated data.",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isVerified: updatedUser.isVerified
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();

        res.json({ message: "User removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};