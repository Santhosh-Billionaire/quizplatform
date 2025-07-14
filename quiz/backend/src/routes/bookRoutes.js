import express from 'express';
import multer from 'multer';
import { uploadBook, getBook, getBookQuestions } from '../controllers/bookController.js';
import { validate as isUUID } from 'uuid';

const router = express.Router();

// Configure Multer for in-memory file uploads (20MB limit)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Upload endpoint — must come before dynamic routes
router.post('/upload', upload.single('file'), uploadBook);

// Middleware to validate UUID param
router.use('/:id', (req, res, next) => {
  const { id } = req.params;
  if (!isUUID(id)) {
    return res.status(400).json({ error: 'Invalid book ID format' });
  }
  next();
});

// Get book metadata by ID
router.get('/:id', getBook);

// Get questions for a book by ID
router.post('/:id/questions', getBookQuestions);

export default router;
