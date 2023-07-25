import app from "./app.js";
import logger from "./config/logger.config.js";

// env variables
const PORT = process.env.PORT || 8000;

console.log(process.env.NODE_ENV);

let server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}.`);
});

// handle server errors
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info("Server closing.");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
}

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// SIGTERM signal
process.on("SIGTERM", () => {
    logger.info("SIGTERM received.");
    if (server) {
        logger.info("Server closing.");
        server.close();
    }
});