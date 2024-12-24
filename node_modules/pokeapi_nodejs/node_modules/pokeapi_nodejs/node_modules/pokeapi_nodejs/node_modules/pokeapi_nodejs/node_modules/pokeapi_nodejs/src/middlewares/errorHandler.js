const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode && err.statusCode >= 100 && err.statusCode < 600 ? err.statusCode : 500;

    res.status(statusCode).json({
        error: {
            message: err.message || "Internal Server Error",
        },
    });
};

export default errorHandler;