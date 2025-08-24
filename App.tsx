import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { LearningScreen } from './src/screens/LearningScreen';
import { WordListScreen } from './src/screens/WordListScreen';
import { loadCSVData } from './src/services/csvLoader';
import {
  saveCards,
  loadCards,
  saveCurrentLanguage,
  loadCurrentLanguage,
} from './src/services/storage';
import { LanguageData, FlashCard } from './src/types';

type Screen = 'home' | 'learning' | 'wordList';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [cards, setCards] = useState<LanguageData>({ english: [], polish: [] });
  const [currentLanguage, setCurrentLanguage] = useState<'english' | 'polish'>('english');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Try to load existing data from storage
      const savedCards = await loadCards();
      const savedLanguage = await loadCurrentLanguage();
      
      if (savedCards) {
        setCards(savedCards);
        setCurrentLanguage(savedLanguage);
      } else {
        // Parse CSV files and create initial data
        await loadCSVDataFromFiles();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to load vocabulary data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCSVDataFromFiles = async () => {
    try {
      const initialCards = await loadCSVData();
      setCards(initialCards);
      await saveCards(initialCards);
      await saveCurrentLanguage('english');
    } catch (error) {
      console.error('Error loading CSV data:', error);
      Alert.alert('Error', 'Failed to load vocabulary files');
    }
  };

  const handleLanguageChange = async (language: 'english' | 'polish') => {
    setCurrentLanguage(language);
    await saveCurrentLanguage(language);
  };

  const handleStartLearning = () => {
    setCurrentScreen('learning');
  };

  const handleViewAllWords = () => {
    setCurrentScreen('wordList');
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleCardUpdate = async (updatedCards: FlashCard[]) => {
    const newCards = {
      ...cards,
      [currentLanguage]: updatedCards,
    };
    setCards(newCards);
    await saveCards(newCards);
  };

  const handleToggleLearned = async (cardId: string, isLearned: boolean) => {
    const updatedCards = cards[currentLanguage].map(card =>
      card.id === cardId ? { ...card, isLearned } : card
    );
    
    const newCards = {
      ...cards,
      [currentLanguage]: updatedCards,
    };
    
    setCards(newCards);
    await saveCards(newCards);
  };

  const handleCardPress = (index: number) => {
    // Navigate to learning screen at specific card
    setCurrentScreen('learning');
    // Note: In a more complex app, you'd pass the index to the learning screen
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196f3" />
          <Text style={styles.loadingText}>Loading vocabulary...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.container}>
        {currentScreen === 'home' && (
          <HomeScreen
            cards={cards}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onStartLearning={handleStartLearning}
            onViewAllWords={handleViewAllWords}
          />
        )}
        
        {currentScreen === 'learning' && (
          <LearningScreen
            cards={cards[currentLanguage]}
            currentLanguage={currentLanguage}
            onBack={handleBack}
            onCardUpdate={handleCardUpdate}
          />
        )}
        
        {currentScreen === 'wordList' && (
          <WordListScreen
            cards={cards[currentLanguage]}
            currentLanguage={currentLanguage}
            onCardPress={handleCardPress}
            onToggleLearned={handleToggleLearned}
            onBack={handleBack}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default App;
