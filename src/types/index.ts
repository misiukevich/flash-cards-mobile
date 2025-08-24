export interface FlashCard {
  id: string;
  item: string;
  translation: string;
  context?: string;
  contextTranslation?: string;
  isLearned: boolean;
  language: 'english' | 'polish';
}

export interface LanguageData {
  english: FlashCard[];
  polish: FlashCard[];
}

export interface AppState {
  cards: LanguageData;
  currentLanguage: 'english' | 'polish';
  currentCardIndex: number;
  showTranslation: boolean;
}
