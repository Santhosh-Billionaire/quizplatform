import express from 'express';
import { generateQuestions, getQuestions } from '../controllers/questionController.js';

const router = express.Router();

router.post('/generate', generateQuestions);
router.get('/', getQuestions);

export default router;
