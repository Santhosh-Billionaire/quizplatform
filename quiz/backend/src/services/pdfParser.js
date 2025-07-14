export async function extractTextFromPDF(buffer) {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error('No PDF buffer provided');
    }

    // ✅ Use the wrapper instead of importing 'pdf-parse' directly
    const pdfParse = (await import('./pdfWrapper.js')).default;

    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error.message);
    throw new Error('Failed to parse PDF: ' + error.message);
  }
}
