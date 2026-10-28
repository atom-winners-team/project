import { AppError } from './AppError.js';

export class ValidationError extends AppError {
    constructor(details = [], message = 'Некорректные данные запроса') {
        super(message, 422, 'VALIDATION_ERROR'); // <--- число 422!
        this.details = details;
    }
}