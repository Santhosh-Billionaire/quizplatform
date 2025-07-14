import express from 'express';
import { setupQuiz, submitResponse, testDatabase, createQuizSessionController, getQuizSessionController, getQuizResultsController } from '../controllers/quizController.js';

const router = express.Router();

router.get('/test', testDatabase);
router.post('/setup', setupQuiz);
router.post('/response', submitResponse);
router.post('/session', createQuizSessionController);
router.get('/session/:quizId', getQuizSessionController);
router.get('/results/:quizId', getQuizResultsController);

export default router;
