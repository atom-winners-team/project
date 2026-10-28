import { processSignal } from '../services/telemetry.js';

export const receiveSignal = async (req, res, next) => {
    try {
        const result = await processSignal(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}