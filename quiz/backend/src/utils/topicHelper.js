import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Get or create a topic by name and book, and return its ID
 * @param {string} bookId - The book ID (REQUIRED)
 * @param {string} topicName - The name of the topic
 * @returns {Promise<string>} The topic ID
 */
export async function getOrCreateTopicId(bookId, topicName) {
  if (!bookId) throw new Error('bookId is required for topic creation!');
  console.log(`🔍 Looking for topic: "${topicName}" for book: ${bookId}`);
  // Try to find topic for this book
  const { data, error } = await supabase
    .from('topics')
    .select('id')
    .eq('name', topicName)
    .eq('book_id', bookId)
    .single();

  if (data) {
    console.log(`✅ Found existing topic: "${topicName}" with ID: ${data.id}`);
    return data.id;
  }

  // If not found, create it
  if (error && error.code === 'PGRST116') {
    console.log(`📝 Creating new topic: "${topicName}" for book: ${bookId}`);
    const insert = await supabase
      .from('topics')
      .insert([{ name: topicName, book_id: bookId }])
      .select('id')
      .single();

    if (insert.error) {
      console.error(`🔥 Failed to create topic "${topicName}":`, insert.error);
      throw insert.error;
    }
    
    console.log(`✅ Created topic: "${topicName}" with ID: ${insert.data.id}`);
    return insert.data.id;
  }

  console.error(`🔥 Unexpected error while looking for topic "${topicName}":`, error);
  throw error;
} 