import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { FlashCard } from '../components/FlashCard';
import { CardNavigator } from '../components/CardNavigator';
import { Header } from '../components/Header';
import { FlashCard as FlashCardType } from '../types';
import { updateCardLearnedStatus, saveCurrentCardIndex } from '../services/storage';

interface LearningScreenProps {
  cards: FlashCardType[];
  currentLanguage: 'english' | 'polish';
  onBack: () => void;
  onCardUpdate: (updatedCards: FlashCardType[]) => void;
}

export const LearningScreen: React.FC<LearningScreenProps> = ({
  cards,
  currentLanguage,
  onBack,
  onCardUpdate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCards, setCurrentCards] = useState(cards);

  useEffect(() => {
    // Save current card index to storage
    saveCurrentCardIndex(currentIndex);
  }, [currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reached the end, show completion message
      Alert.alert(
        'Great Job!',
        'You\'ve reviewed all the words! Would you like to start over?',
        [
          { text: 'Start Over', onPress: () => setCurrentIndex(0) },
          { text: 'Go Back', onPress: onBack },
        ]
      );
    }
  };

  const handleToggleLearned = async (cardId: string, isLearned: boolean) => {
    try {
      // Update in storage
      await updateCardLearnedStatus(cardId, isLearned, currentLanguage);
      
      // Update local state
      const updatedCards = currentCards.map(card =>
        card.id === cardId ? { ...card, isLearned } : card
      );
      
      setCurrentCards(updatedCards);
      onCardUpdate(updatedCards);
    } catch (error) {
      Alert.alert('Error', 'Failed to update card status');
    }
  };

  // const handleCardPress = (_index: number) => {
  //   // setCurrentIndex(index);
  // };

  // Use useEffect to show alert and navigate back when no cards
  React.useEffect(() => {
    if (currentCards.length === 0) {
      Alert.alert('No Cards', 'No cards available for learning.', [
        { text: 'OK', onPress: onBack }
      ]);
    }
  }, [currentCards.length, onBack]);

  if (currentCards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No cards available</Text>
      </View>
    );
  }

  const currentCard = currentCards[currentIndex];

  return (
    <View style={styles.container}>
      <Header
        title={`Learning ${currentLanguage === 'english' ? 'English' : 'Polish'}`}
        onBack={onBack}
        showBackButton={true}
      />
      
      <FlashCard
        card={currentCard}
        onToggleLearned={handleToggleLearned}
      />
      
      <CardNavigator
        currentCard={currentCard}
        currentIndex={currentIndex}
        totalCards={currentCards.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToggleLearned={handleToggleLearned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
