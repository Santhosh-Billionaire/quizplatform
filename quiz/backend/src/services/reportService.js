import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export function generateQuizReport({ questions, responses, summary }) {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(20).text(`Quiz Report`, { align: 'center' });
  doc.moveDown();

  questions.forEach((q, idx) => {
    doc.fontSize(14).text(`Q${idx + 1}: ${q.question}`);
    q.options.forEach((opt, i) => {
      doc.text(`  ${String.fromCharCode(65 + i)}. ${opt}`);
    });
    const userResp = responses[idx]?.selectedIndex;
    doc.text(`Your Answer: ${userResp !== undefined ? q.options[userResp] : 'N/A'}`);
    doc.text(`Correct Answer: ${q.options[parseInt(q.answer)]}`);
    doc.moveDown();
  });

  doc.addPage();
  doc.fontSize(16).text('Performance Summary', { underline: true });
  doc.fontSize(12).text(`Total Questions: ${summary.total}`);
  doc.text(`Correct: ${summary.correct}`);
  doc.text(`Accuracy: ${summary.accuracy}%`);
  doc.text(`Total Time: ${summary.totalTime}s`);

  doc.end();
  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
}
