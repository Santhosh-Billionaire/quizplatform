import { createClient } from '@supabase/supabase-js';
import { getOrCreateTopicId } from '../utils/topicHelper.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const TABLE = 'questions';

export async function createQuestions(questions, bookId, topicMap) {
  const formatted = [];
  
  for (const q of questions) {
    try {
      // Validate required fields
      if (!q.question || !q.options || !q.answer) {
        console.error('❌ Missing question, options, or answer:', q);
        continue;
      }
      // Normalize options to object
      let options = q.options;
      if (typeof options === 'string') {
        try {
          options = JSON.parse(options);
        } catch (e) {
          if (Array.isArray(options)) {
            options = {"A": options[0], "B": options[1], "C": options[2], "D": options[3]};
          }
        }
      } else if (Array.isArray(options)) {
        options = {"A": options[0], "B": options[1], "C": options[2], "D": options[3]};
      }
      if (!options || typeof options !== 'object' || Array.isArray(options)) {
        console.error('❌ Invalid options format:', options);
        continue;
      }
      // Handle missing topics gracefully
      let topicName = q.topic;
      if (!topicName || topicName.trim() === '') {
        console.log(`⚠️ No topic found for question: ${q.question.substring(0, 50)}... - using "General"`);
        topicName = 'General';
      }
      
      // Get or create topic ID
      let topicId = topicMap[topicName];
      if (!topicId) {
        console.log(`⚠️ Topic ID not found for topic: "${topicName}" - creating new topic`);
        try {
          topicId = await getOrCreateTopicId(bookId, topicName);
          topicMap[topicName] = topicId; // Update the map for future use
        } catch (err) {
          console.error(`🔥 Failed to create topic "${topicName}":`, err);
          // Fallback to "General" topic
          topicName = 'General';
          topicId = topicMap[topicName];
          if (!topicId) {
            console.error(`🔥 Even "General" topic failed - skipping question`);
            continue;
          }
        }
      }
      
      // Fallbacks for required fields
      if (!q.options) options = {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"};
      if (!q.answer) q.answer = "A";
      if (!q.difficulty) q.difficulty = "medium";
      
      formatted.push({
        book_id: bookId,
        question: q.question,
        options: options,
        answer: q.answer,
        topic_id: topicId,
        difficulty: q.difficulty || "medium"
      });
    } catch (error) {
      console.error(`🔥 Failed to process question:`, error);
      // Continue with other questions even if one fails
    }
  }
  
  if (formatted.length === 0) {
    throw new Error('No questions could be processed');
  }
  
  const { data, error } = await supabase.from(TABLE).insert(formatted).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function getQuestionsByBookId(bookId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('book_id', bookId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getQuestionById(questionId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', questionId).single();
  if (error) throw new Error(error.message);
  return data;
}

// Fetch questions by an array of IDs
export async function getQuestionsByIds(questionIds) {
  if (!Array.isArray(questionIds) || questionIds.length === 0) return [];
  const { data, error } = await supabase.from(TABLE).select('*').in('id', questionIds);
  if (error) throw new Error(error.message);
  return data;
}
