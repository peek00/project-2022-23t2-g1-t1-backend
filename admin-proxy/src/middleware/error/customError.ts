// Export Custom Error Class
export class CustomError extends Error {
  statusCode: number;
  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super("NotFoundError", message, 404);
  }
}

export class ExpiredError extends CustomError {
  constructor(message: string) {
    super("ExpiredError", message, 410);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super("BadRequestError", message, 400);
  }
}
