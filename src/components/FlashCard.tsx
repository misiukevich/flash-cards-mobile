import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { FlashCard as FlashCardType } from '../types';

interface FlashCardProps {
  card: FlashCardType;
  onToggleLearned: (cardId: string, isLearned: boolean) => void;
}

const { width } = Dimensions.get('window');

export const FlashCard: React.FC<FlashCardProps> = ({ card, onToggleLearned }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));

  const flipCard = () => {
    const toValue = showTranslation ? 0 : 1;
    Animated.spring(flipAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 10,
      friction: 8,
    }).start();
    setShowTranslation(!showTranslation);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handleToggleLearned = () => {
    onToggleLearned(card.id, !card.isLearned);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
          <TouchableOpacity style={styles.cardContent} onPress={flipCard}>
            <Text style={styles.cardText}>{card.item}</Text>
            <Text style={styles.languageLabel}>
              {card.language === 'english' ? 'English' : 'Polish'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <TouchableOpacity style={styles.cardContent} onPress={flipCard}>
            <Text style={styles.translationText}>{card.translation}</Text>
            {card.context && (
              <View style={styles.contextContainer}>
                <Text style={styles.contextLabel}>Context:</Text>
                <Text style={styles.contextText}>{card.context}</Text>
                {card.contextTranslation && (
                  <Text style={styles.contextTranslationText}>
                    {card.contextTranslation}
                  </Text>
                )}
              </View>
            )}
            <Text style={styles.languageLabel}>Russian</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.learnedButton,
          card.isLearned ? styles.learnedButtonActive : styles.learnedButtonInactive,
        ]}
        onPress={handleToggleLearned}
      >
        <Text style={styles.learnedButtonText}>
          {card.isLearned ? '✓ Learned' : '○ Not Learned'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    width: width - 40,
    height: 400,
    position: 'relative',
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: '#50C878',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  translationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  contextContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contextLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  contextText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  contextTranslationText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  languageLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    bottom: 20,
  },
  learnedButton: {
    marginTop: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
  },
  learnedButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  learnedButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#FF5722',
  },
  learnedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
