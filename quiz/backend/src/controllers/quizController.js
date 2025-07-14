import { createClient } from '@supabase/supabase-js';
import { getQuestionsByBookId } from '../models/question.js';
import { createResponse } from '../models/response.js';
import { getQuestionById } from '../models/question.js';
import { isValidUUID } from '../utils/validators.js';
import { createQuizSession, getQuizSessionById } from '../models/quizzes.js';
import { getQuestionsByIds } from '../models/question.js';
import { getResponsesByQuizId } from '../models/response.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function testDatabase(req, res) {
  try {
    const { data, error } = await supabase.from('questions').select('count').limit(1);
    if (error) {
      return res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
    res.json({ message: 'Database connection successful', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function setupQuiz(req, res) {
  try {
    const { bookId, numQuestions } = req.body;
    if (!bookId || bookId === 'null') {
      return res.status(400).json({ error: 'Invalid bookId' });
    }
    const questions = await getQuestionsByBookId(bookId);
    // Shuffle and select numQuestions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numQuestions || 40);
    res.json(selected);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Create a new quiz session
export async function createQuizSessionController(req, res) {
  try {
    const { userId, bookId, topics, difficulty, timeLimit, numQuestions } = req.body;
    if (!userId || !bookId) return res.status(400).json({ error: 'userId and bookId are required' });
    // Fetch all questions for the book, filter by topics/difficulty if provided
    let questions = await getQuestionsByBookId(bookId);
    if (topics && topics.length) {
      questions = questions.filter(q => topics.includes(q.topic_id));
    }
    if (difficulty && difficulty.toLowerCase() !== 'mixed') {
      questions = questions.filter(q => (q.difficulty || 'Mixed').toLowerCase() === difficulty.toLowerCase());
    }
    // If no questions after filtering, return error
    if (!questions.length) {
      return res.status(400).json({ error: 'No questions available for the selected topics and difficulty. Please try different options.' });
    }
    // Shuffle and select numQuestions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numQuestions || 40);
    const questionIds = selected.map(q => q.id);
    // Create quiz session
    const quiz = await createQuizSession({ userId, bookId, topics, difficulty, timeLimit, numQuestions, questionIds });
    res.status(201).json({ quizId: quiz.id, questions: selected, settings: quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Fetch quiz session details (questions, settings)
export async function getQuizSessionController(req, res) {
  try {
    const { quizId } = req.params;
    const quiz = await getQuizSessionById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz session not found' });
    // Get questions for this session
    let questionIds = [];
    if (Array.isArray(quiz.question_ids)) {
      questionIds = quiz.question_ids;
    } else if (typeof quiz.question_ids === 'string') {
      try {
        questionIds = JSON.parse(quiz.question_ids);
      } catch (e) {
        return res.status(500).json({ error: 'Malformed question_ids in quiz session', details: e.message, code: 'MALFORMED_QUESTION_IDS' });
      }
    }
    const questions = await getQuestionsByIds(questionIds);
    res.json({ quiz, questions });
  } catch (error) {
    res.status(500).json({ error: error.message, details: error.stack, code: 'GET_QUIZ_SESSION_ERROR' });
  }
}

// Fetch all responses for a quiz session
export async function getQuizResultsController(req, res) {
  try {
    const { quizId } = req.params;
    const quiz = await getQuizSessionById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz session not found' });
    const responses = await getResponsesByQuizId(quizId);
    // Get questions for this session
    let questionIds = [];
    if (Array.isArray(quiz.question_ids)) {
      questionIds = quiz.question_ids;
    } else if (typeof quiz.question_ids === 'string') {
      try {
        questionIds = JSON.parse(quiz.question_ids);
      } catch (e) {
        return res.status(500).json({ error: 'Malformed question_ids in quiz session', details: e.message, code: 'MALFORMED_QUESTION_IDS' });
      }
    }
    const questions = await getQuestionsByIds(questionIds);
    // Calculate summary
    const correct = responses.filter(r => r.correct).length;
    const total = responses.length;
    const totalTime = responses.reduce((sum, r) => sum + (r.time_taken || 0), 0);
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    res.json({ responses, questions, summary: { total, correct, accuracy, totalTime }, settings: quiz });
  } catch (error) {
    res.status(500).json({ error: error.message, details: error.stack, code: 'GET_QUIZ_RESULTS_ERROR' });
  }
}

// Update submitResponse to require quizId
export async function submitResponse(req, res) {
  try {
    const { questionId, userId, selectedIndex, timeTaken, quizId } = req.body;
    // Strict validation
    if (!questionId || typeof questionId !== 'string' || !isValidUUID(questionId)) {
      return res.status(400).json({ error: 'Invalid or missing questionId (must be a valid UUID)' });
    }
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ error: 'Invalid or missing userId (must be a non-empty string)' });
    }
    if (selectedIndex === undefined || selectedIndex === null || isNaN(selectedIndex)) {
      return res.status(400).json({ error: 'Invalid or missing selectedIndex (must be a number)' });
    }
    if (!quizId || typeof quizId !== 'string' || !isValidUUID(quizId)) {
      return res.status(400).json({ error: 'Invalid or missing quizId (must be a valid UUID)' });
    }
    // Get the question to validate the answer
    const question = await getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    // Check if the selected answer is correct (handle both numeric and text formats)
    let correct;
    if (typeof question.answer === 'number') {
      correct = selectedIndex === question.answer;
    } else if (typeof question.answer === 'string') {
      // If answer is stored as text (e.g., "0", "1", "2"), convert to number
      const correctAnswerIndex = parseInt(question.answer);
      correct = selectedIndex === correctAnswerIndex;
    } else {
      return res.status(500).json({ error: 'Invalid answer format in question' });
    }
    // Store the response with the validated correctness
    const response = await createResponse({ 
      questionId, 
      userId, 
      selectedIndex, 
      correct, 
      timeTaken, 
      quizId
    });
    // Convert answer to number for array indexing
    const correctAnswerIndex = typeof question.answer === 'string' ? parseInt(question.answer) : question.answer;
    const correctAnswerText = question.options[correctAnswerIndex];
    res.status(201).json({
      ...response,
      correct,
      correctAnswer: question.answer,
      correctAnswerText: correctAnswerText || 'Answer not found'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
