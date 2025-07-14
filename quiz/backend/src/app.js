import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import bookRoutes from './routes/bookRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

import topicRoutes from './routes/topicRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

app.use('/api/books', bookRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api', topicRoutes);

app.get('/', (req, res) => {
  res.send('Quiz Platform Backend Running');
});

export default app;
