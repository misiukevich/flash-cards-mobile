import { LanguageData, FlashCard } from '../types';

// Import preprocessed JSON data
import englishData from '../../assets/data/english_vocabulary.json';
import polishData from '../../assets/data/polish_vocabulary.json';

export const loadData = async (): Promise<LanguageData> => {
  try {
    console.log('🔄 Starting vocabulary data loading...');

    // Load preprocessed JSON data
    console.log('📖 Loading English vocabulary from JSON...');
    const englishCards: FlashCard[] = englishData as any;
    console.log(`📊 English JSON loaded: ${englishCards.length} words`);

    console.log('📖 Loading Polish vocabulary from JSON...');
    const polishCards: FlashCard[] = polishData as any;
    console.log(`📊 Polish JSON loaded: ${polishCards.length} words`);

    // Log detailed statistics
    console.log('📈 Vocabulary Loading Statistics:');
    console.log(`   English: ${englishCards.length} words loaded`);
    console.log(`   Polish: ${polishCards.length} words loaded`);
    console.log(`   Total: ${englishCards.length + polishCards.length} words`);

    // Log some sample words
    if (englishCards.length > 0) {
      console.log(`   English sample: "${englishCards[0].item}" → "${englishCards[0].translation}"`);
    }
    if (polishCards.length > 0) {
      console.log(`   Polish sample: "${polishCards[0].item}" → "${polishCards[0].translation}"`);
    }

    console.log('✅ Vocabulary data loading completed successfully!');

    return {
      english: englishCards,
      polish: polishCards,
    };
  } catch (error) {
    console.error('❌ Error loading vocabulary data:', error);
    throw new Error('Failed to load vocabulary data');
  }
};
