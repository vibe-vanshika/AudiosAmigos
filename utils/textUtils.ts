/**
 * Intelligent text chunking that respects sentence boundaries.
 * 
 * Strategy:
 * 1. Split text into natural sentences using punctuation delimiters.
 * 2. Accumulate sentences into a chunk until the maxWords threshold is approached.
 * 3. This ensures audio is never generated from a broken sentence fragment.
 */
export const chunkText = (text: string, maxWords: number = 300): string[] => {
  if (!text || text.trim().length === 0) return [];

  // Regex breakdown:
  // [^.!?]+       Match one or more non-delimiter characters
  // [.!?]+        Match one or more delimiters
  // (\s+|$)       Match trailing whitespace or end of string (lookahead not needed here, we want to consume it)
  // | [^.!?]+$    OR match any remaining non-delimiter text at the end
  const sentenceRegex = /[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g;
  const sentences = text.match(sentenceRegex);

  if (!sentences || sentences.length === 0) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = "";
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const sentenceWordCount = sentence.trim().split(/\s+/).length;

    // Check if adding this sentence would exceed the limit
    // We also ensure the current chunk isn't empty to avoid infinite loops if a single sentence > maxWords
    if (currentWordCount + sentenceWordCount > maxWords && currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
      currentWordCount = sentenceWordCount;
    } else {
      currentChunk += sentence;
      currentWordCount += sentenceWordCount;
    }
  }

  // Add any remaining text
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

/**
 * Splits a single chunk roughly in half at the nearest sentence boundary.
 * Used as a fallback when a chunk repeatedly fails synthesis -- smaller
 * pieces are more likely to succeed with the TTS API.
 * Returns two sub-chunks, or the original in a single-element array if
 * no reasonable split point exists.
 */
export const splitChunk = (chunk: string): string[] => {
  const sentenceRegex = /[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g;
  const sentences = chunk.match(sentenceRegex);

  if (!sentences || sentences.length <= 1) {
    const words = chunk.split(/\s+/);
    if (words.length <= 4) return [chunk];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }

  const midSentence = Math.ceil(sentences.length / 2);
  const first = sentences.slice(0, midSentence).join('').trim();
  const second = sentences.slice(midSentence).join('').trim();

  if (!first) return [second];
  if (!second) return [first];
  return [first, second];
};