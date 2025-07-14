import { getTopicsByBook } from '../models/topic.js';

export async function getTopicsByBookId(req, res) {
  try {
    const { book_id } = req.params;
    const topics = await getTopicsByBook(book_id);
    res.status(200).json({ topics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get topics', details: error.message, code: 'GET_TOPICS_ERROR' });
  }
}
