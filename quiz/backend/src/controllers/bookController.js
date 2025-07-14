import { uploadBookFile } from '../services/storageService.js';
import { extractTextFromPDF } from '../services/pdfParser.js';
import { createBook, getBookById, getQuestionsWithTopics } from '../models/book.js';
import { createQuestions } from '../models/question.js';
import { generateQuestionsFromText } from '../services/aiService.js';
import { getOrCreateTopicId } from '../utils/topicHelper.js';

export async function uploadBook(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded', code: 'NO_FILE', details: null });
    }
    const fileBuffer = req.file.buffer;
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const mimetype = req.file.mimetype;
    const title = req.body.title || req.file.originalname;
    const userId = req.body.userId || null;

    let fileUrl, rawText, questions, book;
    try {
      fileUrl = await uploadBookFile(fileBuffer, fileName, mimetype);
    } catch (e) {
      throw new Error('Storage failed: ' + e.message);
    }

    try {
      rawText = await extractTextFromPDF(fileBuffer);
    } catch (e) {
      throw new Error('PDF parsing failed: ' + e.message);
    }

    try {
      questions = await generateQuestionsFromText(rawText, 40);
    } catch (e) {
      throw new Error('AI generation failed: ' + e.message);
    }

    try {
      book = await createBook({ title, fileUrl, rawText, userId });
    } catch (e) {
      throw new Error('Book save failed: ' + e.message);
    }

    // Build topicMap: topic name -> topic_id
    const topicMap = {};
    const uniqueTopics = [...new Set(questions.map(q => q.topic || 'General'))];
    
    console.log('📊 Processing topics:', uniqueTopics);
    
    for (const topicName of uniqueTopics) {
      try {
        const topicId = await getOrCreateTopicId(book.id, topicName);
        topicMap[topicName] = topicId;
        console.log(`✅ Created/found topic "${topicName}" with ID: ${topicId}`);
      } catch (err) {
        console.error(`🔥 Failed to get/create topic for "${topicName}":`, err);
        // Don't fail the entire process, continue with other topics
      }
    }

    // Store questions with topics using the topicMap
    const savedQuestions = await createQuestions(questions, book.id, topicMap);

    res.status(201).json({ 
      id: book.id, 
      fileUrl, 
      status: 'ready', 
      questions: savedQuestions 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload book', details: error.message, code: 'UPLOAD_BOOK_ERROR' });
  }
}

export async function getBook(req, res) {
  try {
    const book = await getBookById(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(404).json({ error: 'Book not found', details: error.message, code: 'BOOK_NOT_FOUND' });
  }
}

export async function getBookQuestions(req, res) {
  try {
    const bookId = req.params.id;
    const { topics, difficulty } = req.body;
    
    // Get questions with topic information
    let questions = await getQuestionsWithTopics(bookId);
    
    if (topics && topics.length) {
      questions = questions.filter(q => topics.includes(q.topic_id));
    }
    
    if (difficulty && difficulty.toLowerCase() !== 'mixed') {
      questions = questions.filter(q => (q.difficulty || 'Mixed').toLowerCase() === difficulty.toLowerCase());
    }
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get book questions', details: error.message, code: 'BOOK_QUESTIONS_ERROR' });
  }
}
