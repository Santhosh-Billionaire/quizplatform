import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function getTopicsByBook(book_id) {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('book_id', book_id);

  if (error) throw new Error(error.message);
  return data;
} 