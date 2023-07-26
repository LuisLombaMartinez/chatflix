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