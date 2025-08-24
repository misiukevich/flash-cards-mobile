import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LanguageSelector } from '../components/LanguageSelector';
import { LanguageData } from '../types';

interface HomeScreenProps {
  cards: LanguageData;
  currentLanguage: 'english' | 'polish';
  onLanguageChange: (language: 'english' | 'polish') => void;
  onStartLearning: () => void;
  onViewAllWords: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  cards,
  currentLanguage,
  onLanguageChange,
  onStartLearning,
  onViewAllWords,
}) => {
  const englishCount = cards.english.length;
  const polishCount = cards.polish.length;
  const currentCards = cards[currentLanguage];
  const learnedCount = currentCards.filter(card => card.isLearned).length;
  const progress = currentCards.length > 0 ? (learnedCount / currentCards.length) * 100 : 0;

  const handleStartLearning = () => {
    if (currentCards.length === 0) {
      Alert.alert('No Words', 'No words available for the selected language.');
      return;
    }
    onStartLearning();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Flash Cards</Text>
        <Text style={styles.subtitle}>Learn English & Polish vocabulary</Text>
      </View>

      <LanguageSelector
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        englishCount={englishCount}
        polishCount={polishCount}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentCards.length}</Text>
          <Text style={styles.statLabel}>Total Words</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{learnedCount}</Text>
          <Text style={styles.statLabel}>Learned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progress.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleStartLearning}>
          <Text style={styles.primaryButtonText}>Start Learning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={onViewAllWords}>
          <Text style={styles.secondaryButtonText}>View All Words</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  secondaryButtonText: {
    color: '#2196f3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
