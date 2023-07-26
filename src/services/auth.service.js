import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";
import bcrypt from "bcrypt";

// env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser = async (userData) => {
    const { name, email, picture, status, password } = userData;

    // check if fields are empty
    if (!name || !email || !password) {
        throw createHttpError.BadRequest("Please fill in all mandatory fields");
    }

    // check name length
    if (!validator.isLength(name, { min: 2, max: 32 })) {
        throw createHttpError.BadRequest("Name must be between 2 and 32 characters long");
    }

    // check password length
    if (!validator.isLength(password, { min: 8, max: 64 })) {
        throw createHttpError.BadRequest("Password must be between 8 and 64 characters long");
    }

    // check status length
    if (status && status.length > 64) {
        throw createHttpError.BadRequest("Status must be at most 64 characters long");
    }

    // check if email is valid
    if (!validator.isEmail(email)) {
        throw createHttpError.BadRequest("Please provide a valid email");
    }

    //check if user already exist
    const checkDb = await UserModel.findOne({ email });
    if (checkDb) {
        throw createHttpError.Conflict(`${email} is already registered`);
    }

    // create new user
    const user = await new UserModel({
        name,
        email,
        picture: picture || DEFAULT_PICTURE,
        status: status || DEFAULT_STATUS,
        password,
    }).save();

    return user;
};

export const signUser = async (email, password) => {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

    // check if user exist
    if (!user) {
        throw createHttpError.NotFound("Invalid credentials");
    }

    // check if password is correct
    let passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw createHttpError.NotFound("Invalid credentials assadas");
    }

    return user;
};