import dotenv from 'dotenv';
import { migrateMissingTopics, checkTopicStatus } from './src/utils/migrationHelper.js';

// Load environment variables
dotenv.config();

// Check required environment variables
function checkEnvironmentVariables() {
  const required = ['SUPABASE_URL', 'SUPABASE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('🔥 Missing required environment variables:');
    missing.forEach(key => {
      console.error(`   - ${key}`);
    });
    console.error('\n💡 Please create a .env file in the backend directory with:');
    console.error('   SUPABASE_URL=your_supabase_project_url');
    console.error('   SUPABASE_KEY=your_supabase_anon_key');
    console.error('   SUPABASE_BUCKET=your_storage_bucket_name');
    console.error('   GEMINI_API_KEY=your_gemini_api_key');
    console.error('\n📁 Example .env file:');
    console.error('   SUPABASE_URL=https://your-project.supabase.co');
    console.error('   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    console.error('   SUPABASE_BUCKET=quiz-files');
    console.error('   GEMINI_API_KEY=AIzaSy...');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
}

async function runMigration() {
  console.log('🚀 Starting topic migration script...');
  
  try {
    // Check environment variables first
    checkEnvironmentVariables();
    
    // First check the current status
    console.log('\n📊 Checking current database status...');
    await checkTopicStatus();
    
    // Run the migration
    console.log('\n🔄 Running migration...');
    await migrateMissingTopics();
    
    // Check status again after migration
    console.log('\n📊 Checking status after migration...');
    await checkTopicStatus();
    
    console.log('\n✅ Migration script completed successfully!');
    
  } catch (error) {
    console.error('\n🔥 Migration script failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration(); 