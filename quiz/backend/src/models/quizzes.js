import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const TABLE = 'quizzes';
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Create a new quiz session
export async function createQuizSession({ userId, bookId, topics, difficulty, timeLimit, numQuestions, questionIds }) {
  if (!userId || !bookId) throw new Error('userId and bookId are required');
  const { data, error } = await supabase.from(TABLE).insert([
    {
      user_id: userId,
      book_id: bookId,
      topics: topics || [],
      difficulty: difficulty || 'medium',
      time_limit: timeLimit || 0,
      num_questions: numQuestions || 10,
      score: 0,
      total: 0,
      question_ids: questionIds || []
    }
  ]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

// Fetch a quiz session by ID
export async function getQuizSessionById(quizId) {
  if (!uuidRegex.test(quizId)) throw new Error('Invalid UUID for quizId');
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', quizId).single();
  if (error) throw new Error(error.message);
  return data;
}

// List all quiz sessions for a user
export async function getQuizSessionsByUser(userId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('user_id', userId).order('started_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
} 