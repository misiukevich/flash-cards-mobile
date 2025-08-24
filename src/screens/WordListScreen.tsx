import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { WordList } from '../components/WordList';
import { Header } from '../components/Header';
import { FlashCard } from '../types';

interface WordListScreenProps {
  cards: FlashCard[];
  currentLanguage: 'english' | 'polish';
  onCardPress: (index: number) => void;
  onToggleLearned: (cardId: string, isLearned: boolean) => void;
  onBack: () => void;
}

export const WordListScreen: React.FC<WordListScreenProps> = ({
  cards,
  currentLanguage,
  onCardPress,
  onToggleLearned,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title={`${currentLanguage === 'english' ? 'English' : 'Polish'} Vocabulary`}
        onBack={onBack}
        showBackButton={true}
      />
      <WordList
        cards={cards}
        onCardPress={onCardPress}
        onToggleLearned={onToggleLearned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
