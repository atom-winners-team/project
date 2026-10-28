import { ValidationError } from '../errors/ValidationError.js';

const pickTarget = (req, source) => {
    if (source === 'body') return req.body;
    if (source === 'query') return req.query;
    if (source === 'params') return req.params;
    return undefined;
};

const toDetails = (error, source) =>
    error.issues.map((i) => ({
        field: i.path.join('.') || source,
        message: i.message,
    }));

export const validate =
    (schema, source = 'body') =>
        (req, _res, next) => {
            const result = schema.safeParse(pickTarget(req, source));
            if (!result.success) {
                // Любая ошибка валидации теперь возвращает 422 ValidationError
                console.log('seka', toDetails(result.error, source), result.error)
                return next(new ValidationError(toDetails(result.error, source)));
            }
            // заменяем исходные данные распарсенными (с дефолтами и приведением типов)
            if (source === 'body') req.body = result.data;
            else if (source === 'query') req.validatedQuery = result.data;
            else if (source === 'params') req.params = result.data;
            next();
        };