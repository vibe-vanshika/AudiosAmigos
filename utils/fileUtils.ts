/**
 * File extraction utility using native APIs for Text/Markdown
 * and pdfjs-dist for PDF parsing.
 */

// We use a specific version of PDF.js that works well with ESM
const PDFJS_VERSION = '4.0.379';
const PDFJS_CDN = `https://esm.sh/pdfjs-dist@${PDFJS_VERSION}`;

export const extractTextFromFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return extractPdfText(file);
  } else if (extension === 'txt' || extension === 'md') {
    return file.text();
  } else {
    throw new Error('Unsupported file format. Please upload .txt, .md, or .pdf');
  }
};

async function extractPdfText(file: File): Promise<string> {
  try {
    // Dynamically import PDF.js to keep initial load light
    const pdfjsLib = await import(PDFJS_CDN);
    pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/build/pdf.worker.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to read PDF file. It might be encrypted or corrupted.');
  }
}
