import { loadData } from '../src/services/csvLoader';
import { LanguageData, FlashCard } from '../src/types';

// Mock fetch for testing
global.fetch = jest.fn();

describe('loadCSVData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load and parse English CSV data correctly', async () => {
    // Mock English CSV content
    const englishCSVContent = `Item,Translation,Context,Context translation
annual,годовой,annual payment for life,ежегодный пожизненный платеж
on condition,при условии,on condition that he receive smth,"при условии, что он получит что-то"
to stick,придерживаться,to stick to commitments,придерживаться обязательств
retirement,уход на пенсию / уход в отставку,he spent much of his retirement traveling in Europe,"он провел большую часть своей пенсии, путешествуя по Европе"
to resist,сопротивляться,antibodies help us to resist infection,антитела помогают нам противостоять инфекции`;

    // Mock Polish CSV content
    const polishCSVContent = `Item,Translation,Context,Context translation
zapewnić,обеспечить,,
urządzenia,устройства,,
sprzęt,оборудование,может быть и про спортивное обородувание и про технику и тд,
sokowirówka,соковыжималка,,
blender,блендер,,`;

    // Mock fetch responses
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: () => Promise.resolve(englishCSVContent),
      })
      .mockResolvedValueOnce({
        text: () => Promise.resolve(polishCSVContent),
      });

    const result: LanguageData = await loadData();

    // Verify structure
    expect(result).toHaveProperty('english');
    expect(result).toHaveProperty('polish');
    expect(Array.isArray(result.english)).toBe(true);
    expect(Array.isArray(result.polish)).toBe(true);

    // Verify English data
    expect(result.english).toHaveLength(5);
    expect(result.english[0]).toEqual({
      id: 'english_1',
      item: 'annual',
      translation: 'годовой',
      context: 'annual payment for life',
      contextTranslation: 'ежегодный пожизненный платеж',
      isLearned: false,
      language: 'english',
    });

    // Verify Polish data
    expect(result.polish).toHaveLength(5);
    expect(result.polish[0]).toEqual({
      id: 'polish_1',
      item: 'zapewnić',
      translation: 'обеспечить',
      context: undefined,
      contextTranslation: undefined,
      isLearned: false,
      language: 'polish',
    });

    // Verify fetch was called with correct URLs
    expect(fetch).toHaveBeenCalledWith('/data/english_vocabulary.csv');
    expect(fetch).toHaveBeenCalledWith('/data/polish_vocabulary.csv');
  });

  it('should handle empty CSV rows correctly', async () => {
    const csvWithEmptyRows = `Item,Translation,Context,Context translation
annual,годовой,annual payment for life,ежегодный пожизненный платеж
,,,
to stick,придерживаться,to stick to commitments,придерживаться обязательств
,,
retirement,уход на пенсию / уход в отставку,he spent much of his retirement traveling in Europe,"он провел большую часть своей пенсии, путешествуя по Европе"`;

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: () => Promise.resolve(csvWithEmptyRows),
      })
      .mockResolvedValueOnce({
        text: () => Promise.resolve('Item,Translation,Context,Context translation'),
      });

    const result: LanguageData = await loadData();

    // Should only include rows with both Item and Translation
    expect(result.english).toHaveLength(3);
    expect(result.english[0].item).toBe('annual');
    expect(result.english[1].item).toBe('to stick');
    expect(result.english[2].item).toBe('retirement');
  });

  it('should handle quoted fields with commas correctly', async () => {
    const csvWithQuotedFields = `Item,Translation,Context,Context translation
"on condition",при условии,"on condition that he receive smth","при условии, что он получит что-то"
"to stick, to adhere",придерживаться,"to stick to commitments, to adhere to rules","придерживаться обязательств, придерживаться правил"`;

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: () => Promise.resolve(csvWithQuotedFields),
      })
      .mockResolvedValueOnce({
        text: () => Promise.resolve('Item,Translation,Context,Context translation'),
      });

    const result: LanguageData = await loadData();

    expect(result.english).toHaveLength(2);
    expect(result.english[0].item).toBe('on condition');
    expect(result.english[0].context).toBe('on condition that he receive smth');
    expect(result.english[0].contextTranslation).toBe('при условии, что он получит что-то');

    expect(result.english[1].item).toBe('to stick, to adhere');
    expect(result.english[1].context).toBe('to stick to commitments, to adhere to rules');
    expect(result.english[1].contextTranslation).toBe('придерживаться обязательств, придерживаться правил');
  });

  it('should generate correct IDs for flash cards', async () => {
    const csvContent = `Item,Translation,Context,Context translation
word1,translation1,context1,contextTranslation1
word2,translation2,context2,contextTranslation2
word3,translation3,context3,contextTranslation3`;

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: () => Promise.resolve(csvContent),
      })
      .mockResolvedValueOnce({
        text: () => Promise.resolve('Item,Translation,Context,Context translation'),
      });

    const result: LanguageData = await loadData();

    expect(result.english[0].id).toBe('english_1');
    expect(result.english[1].id).toBe('english_2');
    expect(result.english[2].id).toBe('english_3');
  });

  it('should handle fetch errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(loadData()).rejects.toThrow('Failed to load CSV data');
  });

  it('should handle malformed CSV gracefully', async () => {
    const malformedCSV = `Item,Translation,Context,Context translation
word1,translation1,context1,contextTranslation1
invalid,row,without,enough,columns,extra,data
word3,translation3,context3,contextTranslation3`;

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: () => Promise.resolve(malformedCSV),
      })
      .mockResolvedValueOnce({
        text: () => Promise.resolve('Item,Translation,Context,Context translation'),
      });

    const result: LanguageData = await loadData();

    // Should still parse valid rows (PapaParse handles extra columns gracefully)
    expect(result.english).toHaveLength(3);
    expect(result.english[0].item).toBe('word1');
    expect(result.english[1].item).toBe('invalid');
    expect(result.english[2].item).toBe('word3');
  });

  it('should load actual CSV files and return expected number of words', async () => {
    // This test will use the actual CSV files
    // We expect 841 English words and 367 Polish words (after filtering for valid rows)

    // Mock the actual file content by reading the real files
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

    const result: LanguageData = await loadData();

    // Verify we get the expected number of words
    expect(result.english.length).toBe(841); // Should have exactly 841 valid English words
    expect(result.polish.length).toBe(367); // Should have exactly 367 valid Polish words

    // Verify all English cards have required properties
    result.english.forEach((card: FlashCard, index: number) => {
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('item');
      expect(card).toHaveProperty('translation');
      expect(card).toHaveProperty('isLearned');
      expect(card).toHaveProperty('language');
      expect(card.id).toBe(`english_${index + 1}`);
      expect(card.language).toBe('english');
      expect(card.isLearned).toBe(false);
      expect(card.item).toBeTruthy();
      expect(card.translation).toBeTruthy();
    });

    // Verify all Polish cards have required properties
    result.polish.forEach((card: FlashCard, index: number) => {
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('item');
      expect(card).toHaveProperty('translation');
      expect(card).toHaveProperty('isLearned');
      expect(card).toHaveProperty('language');
      expect(card.id).toBe(`polish_${index + 1}`);
      expect(card.language).toBe('polish');
      expect(card.isLearned).toBe(false);
      expect(card.item).toBeTruthy();
      expect(card.translation).toBeTruthy();
    });

    // Verify some specific words are present
    const englishItems = result.english.map(card => card.item);
    const polishItems = result.polish.map(card => card.item);

    expect(englishItems).toContain('annual');
    expect(englishItems).toContain('to stick');
    expect(englishItems).toContain('retirement');

    expect(polishItems).toContain('zapewnić');
    expect(polishItems).toContain('urządzenia');
    expect(polishItems).toContain('sprzęt');
  });
});
