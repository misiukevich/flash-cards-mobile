const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Paths
const assetsDir = path.join(__dirname, '..', 'assets', 'data');
const outputDir = assetsDir;

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// CSV files to convert
const csvFiles = [
  'english_vocabulary.csv',
  'polish_vocabulary.csv'
];

console.log('🔄 Starting CSV to JSON conversion...');
console.log(`📁 Input directory: ${assetsDir}`);
console.log(`📁 Output directory: ${outputDir}`);

csvFiles.forEach(csvFile => {
  const csvPath = path.join(assetsDir, csvFile);
  const jsonFile = csvFile.replace('.csv', '.json');
  const jsonPath = path.join(outputDir, jsonFile);

  console.log(`\n📖 Processing ${csvFile}...`);

  try {
    // Check if CSV file exists
    if (!fs.existsSync(csvPath)) {
      console.log(`⚠️  Warning: ${csvFile} not found, skipping...`);
      return;
    }

    // Read CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    // Parse CSV with PapaParse
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    // Filter out rows without required fields
    const validData = result.data.filter(row => row.Item && row.Translation);
    const skippedRows = result.data.length - validData.length;

    if (skippedRows > 0) {
      console.log(`   ⚠️  Skipped ${skippedRows} rows (missing Item or Translation)`);
    }

    // Convert to FlashCard format
    const language = csvFile.includes('english') ? 'english' : 'polish';
    const flashCards = validData.map((row, index) => ({
      id: `${language}_${index + 1}`,
      item: row.Item?.trim() || '',
      translation: row.Translation?.trim() || '',
      context: row.Context?.trim() || undefined,
      contextTranslation: row['Context translation']?.trim() || undefined,
      isLearned: false,
      language,
    }));

    // Write JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(flashCards, null, 2));

    console.log(`   ✅ Converted ${flashCards.length} valid words to ${jsonFile}`);
    console.log(`   📊 Total rows: ${result.data.length}, Valid: ${flashCards.length}, Skipped: ${skippedRows}`);
  } catch (error) {
    console.error(`   ❌ Error processing ${csvFile}:`, error.message);
  }
});

console.log('\n✅ CSV to JSON conversion completed!');
console.log('📁 JSON files are ready for import in your React Native app.');
