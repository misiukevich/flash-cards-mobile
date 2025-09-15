import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageData } from '../types';

const STORAGE_KEYS = {
  CARDS: 'flash_cards_data',
  CURRENT_LANGUAGE: 'current_language',
  CURRENT_CARD_INDEX: 'current_card_index',
};

export const saveCards = async (cards: LanguageData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  } catch (error) {
    console.error('Error saving cards:', error);
  }
};

export const loadCards = async (): Promise<LanguageData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CARDS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading cards:', error);
    return null;
  }
};

export const saveCurrentLanguage = async (language: 'english' | 'polish'): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LANGUAGE, language);
  } catch (error) {
    console.error('Error saving current language:', error);
  }
};

export const loadCurrentLanguage = async (): Promise<'english' | 'polish'> => {
  try {
    const language = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LANGUAGE);
    return (language as 'english' | 'polish') || 'english';
  } catch (error) {
    console.error('Error loading current language:', error);
    return 'english';
  }
};

export const saveCurrentCardIndex = async (index: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_CARD_INDEX, index.toString());
  } catch (error) {
    console.error('Error saving current card index:', error);
  }
};

export const loadCurrentCardIndex = async (): Promise<number> => {
  try {
    const index = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_CARD_INDEX);
    return index ? parseInt(index, 10) : 0;
  } catch (error) {
    console.error('Error loading current card index:', error);
    return 0;
  }
};

export const updateCardLearnedStatus = async (
  cardId: string,
  isLearned: boolean,
  language: 'english' | 'polish'
): Promise<void> => {
  try {
    const currentData = await loadCards();
    if (currentData) {
      const cardIndex = currentData[language].findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        currentData[language][cardIndex].isLearned = isLearned;
        await saveCards(currentData);
      }
    }
  } catch (error) {
    console.error('Error updating card learned status:', error);
  }
};
