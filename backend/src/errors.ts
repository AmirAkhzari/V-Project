export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(statusCode: number, code: string, message?: string) {
    super(message ?? code);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function apiError(statusCode: number, code: string, message?: string): ApiError {
  return new ApiError(statusCode, code, message);
}
