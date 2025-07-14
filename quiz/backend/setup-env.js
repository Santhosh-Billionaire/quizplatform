import fs from 'fs';
import path from 'path';

console.log('🔧 Environment Setup Helper');
console.log('==========================\n');

const envPath = path.join(process.cwd(), '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('📁 Location:', envPath);
  console.log('\n💡 If you need to update it, edit the file manually or delete it to recreate.');
} else {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_BUCKET=your_storage_bucket_name_here

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📁 Location:', envPath);
    console.log('\n💡 Please edit the .env file and replace the placeholder values with your actual credentials:');
    console.log('   1. SUPABASE_URL - Your Supabase project URL');
    console.log('   2. SUPABASE_KEY - Your Supabase anon/public key');
    console.log('   3. SUPABASE_BUCKET - Your storage bucket name');
    console.log('   4. GEMINI_API_KEY - Your Google Gemini API key');
    console.log('\n🔗 You can find these values in:');
    console.log('   - Supabase Dashboard → Settings → API');
    console.log('   - Google AI Studio → API Keys');
  } catch (error) {
    console.error('🔥 Failed to create .env file:', error.message);
  }
}

console.log('\n📋 Next steps:');
console.log('   1. Edit the .env file with your actual credentials');
console.log('   2. Run: node migrate-topics.js');
console.log('   3. Start your server: npm start'); 