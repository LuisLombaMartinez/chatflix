import jwt from 'jsonwebtoken';
import logger from '../configs/logger.config.js';

export const generateToken = (payload, expiresIn, secret) => {
    try {
        const token = jwt.sign(payload, secret, { expiresIn: expiresIn });
        return token;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

export const verifyToken = async (token, secret) => {
    try {
        const decoded = await jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}
