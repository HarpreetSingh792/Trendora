class ErrorHandler extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
        this.status = status;
    }
}
export default ErrorHandler;
