class AppError extends Error {
    readonly statusCode?: number;
    readonly status: string;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        // Ensure correct stack trace capture
        (Error as any).captureStackTrace(this, this.constructor);
    }
}

export default AppError;
