import { createUser, signUser } from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, picture, status, password } = req.body;
        const newUser = await createUser({
            name,
            email,
            picture,
            status,
            password
        });
        const access_token = await generateToken(
            { userId: newUser._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        );
        const refresh_token = await generateToken(
            { userId: newUser._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        );

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            path: "/api/v1/auth/refresh_token",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            message: "User created successfully",
            access_token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                picture: newUser.picture,
                status: newUser.status,
            }
        });
    } catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await signUser(email, password);
        const access_token = await generateToken(
            { userId: user._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        );
        const refresh_token = await generateToken(
            { userId: user._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        );

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            path: "/api/v1/auth/refresh_token",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        res.status(201).json({
            message: "User created successfully",
            access_token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status,
            }
        });
    } catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        res.clearCookie("refresh_token", { path: "/api/v1/auth/refresh_token" });
        res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        next(error);
    }
};
export const refreshToken = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};