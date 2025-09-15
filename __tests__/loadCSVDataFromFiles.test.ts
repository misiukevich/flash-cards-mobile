import { loadData } from '../src/services/csvLoader';
import { LanguageData } from '../src/types';

// Mock fetch for testing
global.fetch = jest.fn();

// Mock the storage functions
jest.mock('../src/services/storage', () => ({
  saveCards: jest.fn().mockResolvedValue(undefined),
  saveCurrentLanguage: jest.fn().mockResolvedValue(undefined),
}));

describe('loadCSVDataFromFiles Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load all words from CSV files and return complete dataset', async () => {
    // Mock the actual CSV file content
    const fs = require('fs');
    const path = require('path');

    const englishCSVPath = path.join(__dirname, '../data/english_vocabulary.csv');
    const polishCSVPath = path.join(__dirname, '../data/polish_vocabulary.csv');

    const englishCSVContent = fs.readFileSync(englishCSVPath, 'utf8');
    const polishCSVContent = fs.readFileSync(polishCSVPath, 'utf8');

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: () => Promise.resolve(englishCSVContent),
      })
      .mockResolvedValueOnce({
        text: () => Promise.resolve(polishCSVContent),
      });

    // Test the loadCSVData function (which is called by loadCSVDataFromFiles)
    const result: LanguageData = await loadData();

    // Verify we get all expected words
    expect(result.english).toHaveLength(841);
    expect(result.polish).toHaveLength(367);
    expect(result.english.length + result.polish.length).toBe(1208);

    // Verify data integrity
    const allEnglishItems = result.english.map(card => card.item);
    const allPolishItems = result.polish.map(card => card.item);

    // Check for duplicates (there are some duplicates in the CSV files)
    const englishDuplicates = allEnglishItems.filter((item, index) => allEnglishItems.indexOf(item) !== index);
    const polishDuplicates = allPolishItems.filter((item, index) => allPolishItems.indexOf(item) !== index);

    // Note: There are duplicates in the CSV files, so we expect some
    expect(englishDuplicates.length).toBeGreaterThan(0); // 12 duplicates expected
    expect(polishDuplicates.length).toBeGreaterThan(0); // 2 duplicates expected

    // Verify unique word counts
    expect(new Set(allEnglishItems).size).toBe(829); // 841 total - 12 duplicates = 829 unique
    expect(new Set(allPolishItems).size).toBe(364); // 367 total - 3 duplicates = 364 unique

    // Verify all cards have required properties and correct structure
    [...result.english, ...result.polish].forEach((card, index) => {
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('item');
      expect(card).toHaveProperty('translation');
      expect(card).toHaveProperty('isLearned');
      expect(card).toHaveProperty('language');

      expect(typeof card.id).toBe('string');
      expect(typeof card.item).toBe('string');
      expect(typeof card.translation).toBe('string');
      expect(typeof card.isLearned).toBe('boolean');
      expect(['english', 'polish']).toContain(card.language);

      expect(card.item.length).toBeGreaterThan(0);
      expect(card.translation.length).toBeGreaterThan(0);
      expect(card.isLearned).toBe(false);
    });

    // Verify specific words are present
    expect(allEnglishItems).toContain('annual');
    expect(allEnglishItems).toContain('to stick');
    expect(allEnglishItems).toContain('retirement');
    expect(allEnglishItems).toContain('confidence');
    expect(allEnglishItems).toContain('essential');

    expect(allPolishItems).toContain('zapewnić');
    expect(allPolishItems).toContain('urządzenia');
    expect(allPolishItems).toContain('sprzęt');
    expect(allPolishItems).toContain('sokowirówka');
    expect(allPolishItems).toContain('blender');

    // Verify ID generation is correct
    expect(result.english[0].id).toBe('english_1');
    expect(result.english[result.english.length - 1].id).toBe(`english_${result.english.length}`);
    expect(result.polish[0].id).toBe('polish_1');
    expect(result.polish[result.polish.length - 1].id).toBe(`polish_${result.polish.length}`);

    // Verify language assignment
    result.english.forEach(card => {
      expect(card.language).toBe('english');
    });
    result.polish.forEach(card => {
      expect(card.language).toBe('polish');
    });

    console.log(`✅ Successfully loaded ${result.english.length} English words and ${result.polish.length} Polish words`);
    console.log(`✅ Total vocabulary: ${result.english.length + result.polish.length} words`);
  });

  it('should handle context and context translation fields correctly', async () => {
    // Test with CSV that has context data
    const csvWithContext = `Item,Translation,Context,Context translation
annual,годовой,annual payment for life,ежегодный пожизненный платеж
on condition,при условии,on condition that he receive smth,"при условии, что он получит что-то"
simple,простой,,`;

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: () => Promise.resolve(csvWithContext),
      })
      .mockResolvedValueOnce({
        text: () => Promise.resolve('Item,Translation,Context,Context translation'),
      });

    const result: LanguageData = await loadData();

    expect(result.english).toHaveLength(3);

    // Check context handling
    expect(result.english[0].context).toBe('annual payment for life');
    expect(result.english[0].contextTranslation).toBe('ежегодный пожизненный платеж');

    expect(result.english[1].context).toBe('on condition that he receive smth');
    expect(result.english[1].contextTranslation).toBe('при условии, что он получит что-то');

    expect(result.english[2].context).toBeUndefined();
    expect(result.english[2].contextTranslation).toBeUndefined();
  });

  it('should filter out rows without both item and translation', async () => {
    const csvWithIncompleteRows = `Item,Translation,Context,Context translation
annual,годовой,annual payment for life,ежегодный пожизненный платеж
,при условии,on condition that he receive smth,"при условии, что он получит что-то"
to stick,,to stick to commitments,придерживаться обязательств
,,
retirement,уход на пенсию / уход в отставку,he spent much of his retirement traveling in Europe,"он провел большую часть своей пенсии, путешествуя по Европе"`;

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: () => Promise.resolve(csvWithIncompleteRows),
      })
      .mockResolvedValueOnce({
        text: () => Promise.resolve('Item,Translation,Context,Context translation'),
      });

    const result: LanguageData = await loadData();

    // Should only include rows with both Item and Translation
    expect(result.english).toHaveLength(2);
    expect(result.english[0].item).toBe('annual');
    expect(result.english[1].item).toBe('retirement');
  });
});
