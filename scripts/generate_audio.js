import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/audio');
const AUDIO_MAP_FILE = path.resolve(__dirname, '../src/utils/audioMap.js');

const styleSettings = {
  statement: { stability: 0.65, similarity_boost: 0.75, style: 0.3 },
  question: { stability: 0.55, similarity_boost: 0.80, style: 0.5 },
  encouragement: { stability: 0.50, similarity_boost: 0.70, style: 0.7 },
  emphasis: { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
  thinking: { stability: 0.60, similarity_boost: 0.75, style: 0.4 },
  celebration: { stability: 0.45, similarity_boost: 0.65, style: 0.8 }
};

const phrases = [
  { text: 'Welcome, adventurer! Numby needs your help!', style: 'celebration' },
  { text: 'Deep inside the Number Cave, there are mysterious crystals with numbers beyond one hundred.', style: 'statement' },
  { text: 'Can you help Numby read them?', style: 'question' },
  { text: 'Have you ever wondered what number comes after one hundred?', style: 'question' },
  { text: 'Let\'s find out together!', style: 'encouragement' },
  { text: 'After ninety-nine comes one hundred.', style: 'statement' },
  { text: 'After one hundred comes one hundred and one.', style: 'statement' },
  { text: 'After one hundred and one comes one hundred and two.', style: 'statement' },
  { text: 'Keep counting with Numby!', style: 'instruction' },
  { text: 'Let\'s look at the place value chart.', style: 'instruction' },
  { text: 'Every number has three places: hundreds, tens, and ones.', style: 'statement' },
  { text: 'This number has one hundred, three tens, and four ones.', style: 'emphasis' },
  { text: 'So we write: one hundred and thirty-four.', style: 'emphasis' },
  { text: 'Let\'s practice counting tens and ones.', style: 'instruction' },
  { text: 'Count with me! Ten, twenty, thirty, forty, fifty...', style: 'statement' },
  { text: 'We count the hundreds block first, then add the tens and ones!', style: 'emphasis' },
  { text: 'Now let\'s practice matching word names to numbers.', style: 'instruction' },
  { text: 'Remember, we write words exactly as we say them: one hundred and fifty-six.', style: 'statement' },
  { text: 'You are getting very good at this!', style: 'celebration' },
  { text: 'Amazing! You got it right!', style: 'celebration' },
  { text: 'Brilliant! Numby is so proud of you!', style: 'celebration' },
  { text: 'Fantastic! Keep going!', style: 'celebration' },
  { text: 'Not quite! Let\'s try again. You can do it!', style: 'encouragement' },
  { text: 'Incredible work! You are now a Number Explorer!', style: 'celebration' },
  { text: 'You can read and write all numbers from one hundred to two hundred!', style: 'celebration' },
  { text: 'Numby has collected all the crystals thanks to you!', style: 'statement' },
];

function sanitizeFilename(text, index) {
  const sanitized = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30);
  return `audio_${sanitized}_${index}.mp3`;
}

async function generateAudio() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_api_key_here') {
    console.warn("⚠  VITE_ELEVENLABS_API_KEY is not set. Generating mock files + audioMap.js.");
  }

  const audioMap = {};
  
  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = sanitizeFilename(text, i);
    const filepath = path.join(OUTPUT_DIR, filename);
    const relativePath = `/assets/audio/${filename}`;
    
    audioMap[text] = relativePath;

    if (fs.existsSync(filepath)) {
      console.log(`✓ [${i}] Skipping: "${text.substring(0, 40)}..." (exists)`);
      continue;
    }

    if (ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== 'your_api_key_here') {
      try {
        console.log(`🎙  [${i}] Generating: "${text.substring(0, 40)}..." [${style}]`);
        const settings = styleSettings[style] || styleSettings.statement;
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: text,
            model_id: MODEL_ID,
            voice_settings: {
              stability: settings.stability,
              similarity_boost: settings.similarity_boost,
              style: settings.style,
              use_speaker_boost: true
            }
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        console.log(`   ✓ Saved: ${filename}`);
        
        // Rate limit: 500ms between requests
        await new Promise(r => setTimeout(r, 500));
      } catch (error) {
        console.error(`   ✗ Failed: ${error.message}`);
      }
    } else {
      // Mock: create placeholder file
      fs.writeFileSync(filepath, 'dummy audio content');
      console.log(`📝 [${i}] Mock: ${filename}`);
    }
  }

  // Generate audioMap.js
  const mapContent = `// Auto-generated by scripts/generate_audio.js
// Run: node scripts/generate_audio.js
export const audioMap = ${JSON.stringify(audioMap, null, 2)};
`;
  
  const mapDir = path.dirname(AUDIO_MAP_FILE);
  if (!fs.existsSync(mapDir)) {
    fs.mkdirSync(mapDir, { recursive: true });
  }

  fs.writeFileSync(AUDIO_MAP_FILE, mapContent);
  console.log(`\n✅ Generated audioMap.js with ${Object.keys(audioMap).length} entries.`);
  console.log(`📁 Audio files: ${OUTPUT_DIR}`);
}

generateAudio();