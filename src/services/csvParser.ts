import { FlashCard } from '../types';

export const parseCSV = (csvContent: string, language: 'english' | 'polish'): FlashCard[] => {
  const lines = csvContent.split('\n');
  const cards: FlashCard[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV parsing with proper comma handling
    const columns = parseCSVLine(line);
    
    if (columns.length >= 2) {
      const card: FlashCard = {
        id: `${language}_${i}`,
        item: columns[0]?.trim() || '',
        translation: columns[1]?.trim() || '',
        context: columns[2]?.trim() || undefined,
        contextTranslation: columns[3]?.trim() || undefined,
        isLearned: false,
        language,
      };
      
      // Only add cards with valid content
      if (card.item && card.translation) {
        cards.push(card);
      }
    }
  }
  
  return cards;
};

// Helper function to parse CSV line properly handling quoted fields
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};
