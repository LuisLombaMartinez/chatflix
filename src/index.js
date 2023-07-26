import app from "./app.js";
import logger from "./configs/logger.config.js";
import mongoose from "mongoose";

// env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
    logger.info(`${process.env.NODE_ENV} environment mode.`);
    mongoose.set("debug", true);
}

// mongodb connection
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info("MongoDB connected.")
})

// exit on mongodb connection error
mongoose.connection.on("error", (error) => {
    logger.error(`MongoDB connection error: ${error}`);
    process.exit(1);
});

// start server
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