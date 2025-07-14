import { generateQuestionsFromText } from '../services/aiService.js';
import { createQuestions, getQuestionsByBookId } from '../models/question.js';
import { getBookById } from '../models/book.js';

export async function generateQuestions(req, res) {
  try {
    const { bookId, numQuestions } = req.body;
    const book = await getBookById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found', code: 'BOOK_NOT_FOUND', details: null });
    
    const questions = await generateQuestionsFromText(book.raw_text, numQuestions || 40);
    
    const savedQuestions = await createQuestions(questions, bookId);
    
    res.status(201).json(savedQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions', details: error.message, code: 'GENERATE_QUESTIONS_ERROR' });
  }
}

export async function getQuestions(req, res) {
  try {
    const { bookId } = req.query;
    const questions = await getQuestionsByBookId(bookId);
    res.json(questions);
  } catch (error) {
    res.status(404).json({ error: 'Failed to get questions', details: error.message, code: 'GET_QUESTIONS_ERROR' });
  }
}
