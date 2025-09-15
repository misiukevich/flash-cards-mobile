import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { FlashCard } from '../types';

interface WordListProps {
  cards: FlashCard[];
  onCardPress: (index: number) => void;
  onToggleLearned: (cardId: string, isLearned: boolean) => void;
}

export const WordList: React.FC<WordListProps> = ({
  cards,
  onCardPress,
  onToggleLearned,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLearned, setFilterLearned] = useState<'all' | 'learned' | 'unlearned'>('all');

  const filteredCards = useMemo(() => {
    let filtered = cards;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        card =>
          card.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (card.context && card.context.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by learned status
    switch (filterLearned) {
      case 'learned':
        filtered = filtered.filter(card => card.isLearned);
        break;
      case 'unlearned':
        filtered = filtered.filter(card => !card.isLearned);
        break;
      default:
        break;
    }

    return filtered;
  }, [cards, searchQuery, filterLearned]);

  const renderCard = ({ item, index: _index }: { item: FlashCard; index: number }) => {
    const originalIndex = cards.findIndex(card => card.id === item.id);
    
    return (
      <TouchableOpacity
        style={[styles.cardItem, item.isLearned && styles.cardItemLearned]}
        onPress={() => onCardPress(originalIndex)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardWord}>{item.item}</Text>
            <TouchableOpacity
              style={[
                styles.learnedIndicator,
                item.isLearned ? styles.learnedIndicatorActive : styles.learnedIndicatorInactive,
              ]}
              onPress={() => onToggleLearned(item.id, !item.isLearned)}
            >
              <Text style={styles.learnedIndicatorText}>
                {item.isLearned ? '✓' : '○'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.cardTranslation}>{item.translation}</Text>
          
          {item.context && (
            <Text style={styles.cardContext} numberOfLines={2}>
              {item.context}
            </Text>
          )}
          
          <Text style={styles.cardLanguage}>
            {item.language === 'english' ? '🇺🇸 English' : '🇵🇱 Polish'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const stats = useMemo(() => {
    const total = cards.length;
    const learned = cards.filter(card => card.isLearned).length;
    const unlearned = total - learned;
    
    return { total, learned, unlearned };
  }, [cards]);

  return (
    <View style={styles.container}>
      {/* Search and filter controls */}
      <View style={styles.controlsContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search words..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filterLearned === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterLearned('all')}
          >
            <Text style={[styles.filterButtonText, filterLearned === 'all' && styles.filterButtonTextActive]}>
              All ({stats.total})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterLearned === 'learned' && styles.filterButtonActive]}
            onPress={() => setFilterLearned('learned')}
          >
            <Text style={[styles.filterButtonText, filterLearned === 'learned' && styles.filterButtonTextActive]}>
              Learned ({stats.learned})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterLearned === 'unlearned' && styles.filterButtonActive]}
            onPress={() => setFilterLearned('unlearned')}
          >
            <Text style={[styles.filterButtonText, filterLearned === 'unlearned' && styles.filterButtonTextActive]}>
              Unlearned ({stats.unlearned})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Word list */}
      <FlatList
        data={filteredCards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No words found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  controlsContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  cardItem: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardItemLearned: {
    backgroundColor: '#f0f8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardWord: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  learnedIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  learnedIndicatorActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  learnedIndicatorInactive: {
    backgroundColor: 'transparent',
    borderColor: '#FF5722',
  },
  learnedIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cardTranslation: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 8,
  },
  cardContext: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  cardLanguage: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
