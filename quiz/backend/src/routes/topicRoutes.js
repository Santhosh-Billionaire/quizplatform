import express from 'express';
import { getTopicsByBookId } from '../controllers/topicController.js';

const router = express.Router();

router.get('/books/:book_id/topics', getTopicsByBookId);

export default router; 