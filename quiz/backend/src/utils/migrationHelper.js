import { createClient } from '@supabase/supabase-js';
import { getOrCreateTopicId } from './topicHelper.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Migration script to fix questions missing topics
 * Run this to update existing questions that don't have topics
 */
export async function migrateMissingTopics() {
  console.log('🔄 Starting migration for questions missing topics...');
  
  try {
    // Get all questions that don't have a topic_id
    const { data: questionsWithoutTopics, error: fetchError } = await supabase
      .from('questions')
      .select('id, book_id, question, topic_id')
      .is('topic_id', null);
    
    if (fetchError) {
      throw new Error(`Failed to fetch questions: ${fetchError.message}`);
    }
    
    console.log(`📊 Found ${questionsWithoutTopics.length} questions without topics`);
    
    if (questionsWithoutTopics.length === 0) {
      console.log('✅ No questions need migration - all questions have topics!');
      return;
    }
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const question of questionsWithoutTopics) {
      try {
        // Create a "General" topic for this book if it doesn't exist
        const topicId = await getOrCreateTopicId(question.book_id, 'General');
        
        // Update the question with the topic_id
        const { error: updateError } = await supabase
          .from('questions')
          .update({ topic_id: topicId })
          .eq('id', question.id);
        
        if (updateError) {
          console.error(`🔥 Failed to update question ${question.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Updated question ${question.id} with "General" topic`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`🔥 Error processing question ${question.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`🎉 Migration complete!`);
    console.log(`✅ Successfully updated: ${updatedCount} questions`);
    console.log(`❌ Failed to update: ${errorCount} questions`);
    
  } catch (error) {
    console.error('🔥 Migration failed:', error);
    throw error;
  }
}

/**
 * Check the current state of topics in the database
 */
export async function checkTopicStatus() {
  console.log('🔍 Checking topic status in database...');
  
  try {
    // Count questions without topics
    const { data: questionsWithoutTopics, error: fetchError1 } = await supabase
      .from('questions')
      .select('id')
      .is('topic_id', null);
    
    if (fetchError1) {
      throw new Error(`Failed to fetch questions without topics: ${fetchError1.message}`);
    }
    
    // Count total questions
    const { count: totalQuestions, error: fetchError2 } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
    
    if (fetchError2) {
      throw new Error(`Failed to fetch total questions: ${fetchError2.message}`);
    }
    
    // Count topics
    const { data: topics, error: fetchError3 } = await supabase
      .from('topics')
      .select('id, name');
    
    if (fetchError3) {
      throw new Error(`Failed to fetch topics: ${fetchError3.message}`);
    }
    
    console.log('📊 Database Status:');
    console.log(`   Total questions: ${totalQuestions}`);
    console.log(`   Questions without topics: ${questionsWithoutTopics.length}`);
    console.log(`   Total topics: ${topics.length}`);
    
    if (questionsWithoutTopics.length > 0) {
      console.log(`⚠️  ${questionsWithoutTopics.length} questions need topic migration`);
      console.log('💡 Run migrateMissingTopics() to fix this');
    } else {
      console.log('✅ All questions have topics!');
    }
    
    return {
      totalQuestions,
      questionsWithoutTopics: questionsWithoutTopics.length,
      totalTopics: topics.length
    };
    
  } catch (error) {
    console.error('🔥 Failed to check topic status:', error);
    throw error;
  }
} 