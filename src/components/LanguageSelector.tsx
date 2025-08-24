import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface LanguageSelectorProps {
  currentLanguage: 'english' | 'polish';
  onLanguageChange: (language: 'english' | 'polish') => void;
  englishCount: number;
  polishCount: number;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  englishCount,
  polishCount,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Language</Text>
      
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            currentLanguage === 'english' && styles.languageButtonActive,
          ]}
          onPress={() => onLanguageChange('english')}
        >
          <Text style={styles.languageFlag}>🇺🇸</Text>
          <Text style={[
            styles.languageText,
            currentLanguage === 'english' && styles.languageTextActive,
          ]}>
            English
          </Text>
          <Text style={[
            styles.languageCount,
            currentLanguage === 'english' && styles.languageCountActive,
          ]}>
            {englishCount} words
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            currentLanguage === 'polish' && styles.languageButtonActive,
          ]}
          onPress={() => onLanguageChange('polish')}
        >
          <Text style={styles.languageFlag}>🇵🇱</Text>
          <Text style={[
            styles.languageText,
            currentLanguage === 'polish' && styles.languageTextActive,
          ]}>
            Polish
          </Text>
          <Text style={[
            styles.languageCount,
            currentLanguage === 'polish' && styles.languageCountActive,
          ]}>
            {polishCount} words
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  languageButtonActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  languageFlag: {
    fontSize: 40,
    marginBottom: 10,
  },
  languageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  languageTextActive: {
    color: '#2196f3',
  },
  languageCount: {
    fontSize: 14,
    color: '#999',
  },
  languageCountActive: {
    color: '#2196f3',
  },
});
