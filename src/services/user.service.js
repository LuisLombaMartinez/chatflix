import { UserModel } from "../models/index.js";
import createHttpError from "http-errors";

export const findUser = async (userId) => {

    const user = await UserModel.findById(userId).lean();

    if (!user) {
        throw createHttpError.NotFound("User not found");
    }

    return user;
};