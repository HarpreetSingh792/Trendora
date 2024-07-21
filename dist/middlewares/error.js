// Creating a Middleware for custom errors....
export const errorMiddleware = (error, req, res, next) => {
    error.message || (error.message = "Internal Server Error");
    error.status || (error.status = 500);
    if (error.name === "CastError")
        error.message = "Invalid ID";
    return res.status(error.status).json({
        success: false,
        message: error.message
    });
};
// Try Catch Wrapper Function .....
export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
