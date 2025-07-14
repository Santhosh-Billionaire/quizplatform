import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const TABLE = 'books';

export async function createBook({ title, fileUrl, rawText, userId }) {
  const { data, error } = await supabase.from(TABLE).insert([
    {
      title,
      file_url: fileUrl,
      raw_text: rawText,
      user_id: userId || null
    }
  ]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getBookById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createTopic({ bookId, name }) {
  const { data, error } = await supabase.from('topics').insert([
    { book_id: bookId, name }
  ]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

// Get topic ID by name (or create it if not exists)
export async function getOrCreateTopic(bookId, name) {
  console.log(`🔍 Looking for topic: "${name}" in book: ${bookId}`);
  
  // First, try to find existing topic
  let { data, error } = await supabase
    .from('topics')
    .select('id, name')
    .eq('book_id', bookId)
    .eq('name', name)
    .single();

  if (error && error.code === 'PGRST116') {
    // Topic not found – create it
    console.log(`📝 Creating new topic: "${name}"`);
    const insert = await supabase
      .from('topics')
      .insert([{ book_id: bookId, name }])
      .select('id, name')
      .single();
    
    if (insert.error) throw new Error(insert.error.message);
    console.log(`✅ Created topic: "${name}" with ID: ${insert.data.id}`);
    return insert.data;
  } else if (data) {
    console.log(`✅ Found existing topic: "${name}" with ID: ${data.id}`);
    return data;
  } else {
    throw new Error(`Failed to get/create topic: ${error.message}`);
  }
}

export async function createQuestion({ bookId, topicId, question, options, answer, difficulty }) {
  const { data, error } = await supabase.from('questions').insert([
    { book_id: bookId, topic_id: topicId, question, options, answer, difficulty }
  ]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getTopicsByBookId(bookId) {
  const { data, error } = await supabase.from('topics').select('*').eq('book_id', bookId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getQuestionsByBookId(bookId, topicId = null) {
  let query = supabase.from('questions').select('*').eq('book_id', bookId);
  if (topicId) query = query.eq('topic_id', topicId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

// Get questions with topic information
export async function getQuestionsWithTopics(bookId, topicId = null) {
  let query = supabase
    .from('questions')
    .select(`
      *,
      topics (
        id,
        name
      )
    `)
    .eq('book_id', bookId);
    
  if (topicId) query = query.eq('topic_id', topicId);
  
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
