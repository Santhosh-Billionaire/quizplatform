import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function checkAndFixDatabase() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check if responses table exists and has the correct columns
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'responses');
    
    if (columnError) {
      console.error('🔥 Error checking schema:', columnError);
      return false;
    }
    
    console.log('📋 Current responses table columns:', columns);
    
    // Check if selected_index column exists
    const hasSelectedIndex = columns.some(col => col.column_name === 'selected_index');
    
    if (!hasSelectedIndex) {
      console.log('⚠️ selected_index column missing, attempting to add...');
      
      // Try to add the column
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE responses ADD COLUMN selected_index integer'
      });
      
      if (alterError) {
        console.error('🔥 Error adding selected_index column:', alterError);
        return false;
      }
      
      console.log('✅ selected_index column added successfully');
    } else {
      console.log('✅ selected_index column exists');
    }
    
    return true;
  } catch (error) {
    console.error('🔥 Database check failed:', error);
    return false;
  }
} 