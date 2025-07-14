import { getResponsesByUserAndBook, getResponsesWithQuestions } from '../models/response.js';
import { getQuestionsByBookId } from '../models/question.js';
import { getBookById } from '../models/book.js';
import { generateQuizReport } from '../services/reportService.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function testResults(req, res) {
  try {
    console.log('🧪 Testing results endpoint...');
    
    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('responses')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('🔥 Database test failed:', testError);
      return res.status(500).json({ 
        error: 'Database connection failed', 
        details: testError.message 
      });
    }
    
    // Test questions table
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('count')
      .limit(1);
    
    if (questionsError) {
      console.error('🔥 Questions table test failed:', questionsError);
      return res.status(500).json({ 
        error: 'Questions table access failed', 
        details: questionsError.message 
      });
    }
    
    res.json({ 
      message: 'Database connection successful',
      responsesCount: testData?.length || 0,
      questionsCount: questionsData?.length || 0
    });
  } catch (error) {
    console.error('🔥 Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getResults(req, res) {
  try {
    const { userId, bookId } = req.query;
    if (!userId || !bookId) {
      return res.status(400).json({ error: 'Missing required parameters: userId and bookId', code: 'MISSING_PARAMS', details: null });
    }
    const responses = await getResponsesWithQuestions(userId, bookId);
    const questions = await getQuestionsByBookId(bookId);
    const correct = responses.filter(r => r.correct).length;
    const total = responses.length;
    const totalTime = responses.reduce((sum, r) => sum + (r.time_taken || 0), 0);
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    res.json({ responses, questions, summary: { total, correct, accuracy, totalTime } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get results', details: error.message, code: 'GET_RESULTS_ERROR' });
  }
}

export async function downloadReport(req, res) {
  try {
    const { userId, bookId } = req.query;
    const book = await getBookById(bookId);
    const questions = await getQuestionsByBookId(bookId);
    const responses = await getResponsesWithQuestions(userId, bookId);
    const correct = responses.filter(r => r.correct).length;
    const total = responses.length;
    const totalTime = responses.reduce((sum, r) => sum + (r.time_taken || 0), 0);
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const summary = { total, correct, accuracy, totalTime };
    const pdfBuffer = await generateQuizReport({ questions, responses, summary });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=quiz_report_${bookId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download report', details: error.message, code: 'DOWNLOAD_REPORT_ERROR' });
  }
}
