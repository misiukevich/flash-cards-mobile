import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FlashCard } from '../types';

interface CardNavigatorProps {
  currentCard: FlashCard;
  currentIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
  onToggleLearned: (cardId: string, isLearned: boolean) => void;
}

// const { width } = Dimensions.get('window');

export const CardNavigator: React.FC<CardNavigatorProps> = ({
  currentCard,
  currentIndex,
  totalCards,
  onPrevious,
  onNext,
  onToggleLearned: _onToggleLearned,
}) => {
  const progress = ((currentIndex + 1) / totalCards) * 100;
  const learnedCount = totalCards > 0 ? 
    Math.round((currentCard.isLearned ? 1 : 0) / totalCards * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {totalCards}
        </Text>
      </View>

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={onPrevious}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navButtonText, currentIndex === 0 && styles.navButtonTextDisabled]}>
            ← Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentIndex === totalCards - 1 && styles.navButtonDisabled]}
          onPress={onNext}
          disabled={currentIndex === totalCards - 1}
        >
          <Text style={[styles.navButtonText, currentIndex === totalCards - 1 && styles.navButtonTextDisabled]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Progress: {progress.toFixed(1)}%
        </Text>
        <Text style={styles.statsText}>
          Learned: {learnedCount}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 60,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  navButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  navButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
