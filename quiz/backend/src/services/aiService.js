import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1alpha/models/gemini-1.5-flash:generateContent';

export async function generateQuestionsFromText(bookText, numQuestions = 40) {
  const prompt = `You are a quiz generator.\n\nGiven a book text, generate ${numQuestions} multiple choice questions in this exact JSON format:\n\n[\n  {\n    "question": "What is RTB?",
    "options": {"A": "Real-Time Bidding", "B": "Random Targeting", "C": "Bidder Budget", "D": "Repeatable Test Behavior"},
    "answer": "A",
    "topic": "AdTech Basics",
    "difficulty": "medium"
  }\n]\n\nRequirements:\n- options: always an object with keys A, B, C, D.\n- answer: must be the single letter only (A, B, C, or D) matching the correct option.\n- topic: must be a relevant topic/subject from the book content.\n- difficulty: must be present (easy, medium, hard).\n- No explanations, no reasoning, no markdown, just strict JSON.\n\nBook Text:\n${bookText.slice(0, 12000)}`;

  try {
    console.log('🚀 Making Gemini API request...');
    console.log('📝 Prompt length:', prompt.length);
    console.log('🔑 API Key present:', !!GEMINI_API_KEY);
    
    const requestData = {
      contents: [{ parts: [{ text: prompt }] }],
    };
    
    console.log('📤 Request payload size:', JSON.stringify(requestData).length);
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestData
    );

    console.log('✅ Gemini API response received');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response headers:', response.headers);

    let text = response.data.candidates[0].content.parts[0].text.trim();
    console.log('📝 Raw response text length:', text.length);
    console.log('📝 Raw response preview:', text.substring(0, 200) + '...');

    // ✅ Remove markdown-style backticks and code fences
    if (text.startsWith("```")) {
      text = text.replace(/```(?:json)?/g, "").trim();
      console.log('🧹 Cleaned markdown from response');
    }

    // ✅ Parse cleaned JSON
    const parsedQuestions = JSON.parse(text);
    // Validate and normalize options to always be an object, and add fallback for missing fields
    const questionsWithOptions = parsedQuestions.map(q => {
      // Fallbacks for required fields
      if (!q.options) q.options = {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"};
      if (!q.answer) q.answer = "A";
      if (!q.topic) q.topic = "General";
      if (!q.difficulty) q.difficulty = "medium";
      if (typeof q.options === 'string') {
        try {
          q.options = JSON.parse(q.options);
        } catch (e) {
          if (Array.isArray(q.options)) {
            q.options = {"A": q.options[0], "B": q.options[1], "C": q.options[2], "D": q.options[3]};
          }
        }
      } else if (Array.isArray(q.options)) {
        q.options = {"A": q.options[0], "B": q.options[1], "C": q.options[2], "D": q.options[3]};
      }
      return q;
    });
    console.log('✅ Successfully parsed JSON response');
    console.log('📊 Number of questions generated:', parsedQuestions.length);
    
    // ✅ Add fallback topics for questions missing topics
    const questionsWithTopics = questionsWithOptions.map(q => {
      if (!q.topic || q.topic.trim() === '') {
        q.topic = 'General';
      }
      return q;
    });
    
    // Log topic distribution
    const topicCounts = {};
    questionsWithTopics.forEach(q => {
      const topic = q.topic || 'General';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
    console.log('📊 Topic distribution:', topicCounts);
    
    return questionsWithTopics;

  } catch (error) {
    console.error('🔥 ===== GEMINI API ERROR DETAILS =====');
    console.error('🔥 Error type:', error.constructor.name);
    console.error('🔥 Error message:', error.message);
    
    // Log axios-specific error details
    if (error.response) {
      console.error('🔥 Response status:', error.response.status);
      console.error('🔥 Response status text:', error.response.statusText);
      console.error('🔥 Response headers:', error.response.headers);
      console.error('🔥 Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.request) {
      console.error('🔥 Request was made but no response received');
      console.error('🔥 Request details:', error.request);
    }
    
    // Log request details
    console.error('🔥 Request URL:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY ? '[HIDDEN]' : 'MISSING'}`);
    console.error('🔥 API Key present:', !!GEMINI_API_KEY);
    console.error('🔥 Prompt length:', prompt.length);
    console.error('🔥 ===== END ERROR DETAILS =====');
    
    throw new Error(`Gemini AI error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
  }
}
