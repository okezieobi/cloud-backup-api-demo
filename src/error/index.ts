export default class AppError extends Error {
  data: { timestamp: Date; location: string; };

  constructor(message: string = 'Unspecified error', location: string = 'App', data: object = {}) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
    // Custom debugging information
    this.data = {
      location,
      ...data,
      timestamp: new Date(),
    };
    // Maintains proper stack trace for where our error was thrown (only available on V8)
  }
}
