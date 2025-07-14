import express from 'express';
import { getResults, downloadReport, testResults } from '../controllers/resultController.js';

const router = express.Router();

router.get('/test', testResults);
router.get('/', getResults);
router.get('/report', downloadReport);

export default router;
