import express from 'express';
import * as ctrl from '../controllers/equipmentController.js';

const router = express.Router();

router.post('/import', ctrl.importBook);
router.get('/registry', ctrl.getRegistry);
router.get('/registry/:id', ctrl.getEquipmentWithHistory);
router.get('/import/reports', ctrl.getImportReports);
router.get('/history/unmatched', ctrl.getUnmatchedHistory);

export default router;
