import { Router } from 'express';
import { receiveSignal } from '../controllers/telemetry.js';

const router = Router();

router.post('/signals', receiveSignal);

export default router;