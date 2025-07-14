import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const TABLE = 'responses';
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function createResponse({ questionId, userId, selectedIndex, correct, timeTaken, quizId }) {
  if (!uuidRegex.test(questionId)) throw new Error('Invalid UUID for questionId');
  if (quizId && !uuidRegex.test(quizId)) throw new Error('Invalid UUID for quizId');
  console.log('💾 Writing response for questionId:', questionId, 'quizId:', quizId);
  const { data, error } = await supabase.from(TABLE).insert([
    {
      question_id: questionId,
      user_id: userId,
      selected_index: typeof selectedIndex === 'number' ? selectedIndex : parseInt(selectedIndex) || 0,
      correct: !!correct,
      time_taken: timeTaken || 0,
      quiz_id: quizId || null
    }
  ]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getResponsesByUserAndBook(userId, bookId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, question:questions(*)')
    .eq('user_id', userId)
    .eq('question.book_id', bookId);
  if (error) throw new Error(error.message);
  return data;
}

// New function to get responses with question details
export async function getResponsesWithQuestions(userId, bookId) {
  console.log('🔍 Getting responses with questions for user:', userId, 'book:', bookId);
  
  try {
    // First get all questions for the book
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id')
      .eq('book_id', bookId);
    
    if (questionsError) {
      console.error('🔥 Error fetching questions:', questionsError);
      throw new Error(questionsError.message);
    }
    
    const questionIds = questions.map(q => q.id);
    console.log('📝 Found question IDs:', questionIds.length);
    
    if (questionIds.length === 0) {
      console.log('⚠️ No questions found for book:', bookId);
      return [];
    }
    
    // Now get responses for these questions
    const { data: responses, error: responsesError } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .in('question_id', questionIds);
    
    if (responsesError) {
      console.error('🔥 Error fetching responses:', responsesError);
      throw new Error(responsesError.message);
    }
    
    console.log('✅ Found responses for book:', responses?.length || 0);
    return responses || [];
    
  } catch (error) {
    console.error('🔥 Error in getResponsesWithQuestions:', error);
    throw error;
  }
}

// Fetch all responses for a given quiz session
export async function getResponsesByQuizId(quizId) {
  if (!uuidRegex.test(quizId)) throw new Error('Invalid UUID for quizId');
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, question:questions(*)')
    .eq('quiz_id', quizId);
  if (error) throw new Error(error.message);
  return data;
}
