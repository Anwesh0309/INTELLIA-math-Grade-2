// src/utils/questionBank.js
import { numberToWords } from './numberWords.js';

// Seeded pseudo-random number generator (Mulberry32)
function seededRandom(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getDigitAtPlace(n, place) {
  const str = String(n); // e.g., "145"
  if (place === 'hundreds') return str[0];
  if (place === 'tens') return str[1];
  if (place === 'ones') return str[2];
  return '0';
}

function generateDistractors(n, wordConverter, count, rng) {
  const distractors = new Set();
  
  // Rule 1: Swap tens and ones digit
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  const tens = Math.floor(remainder / 10);
  const ones = remainder % 10;
  if (tens !== ones) {
    const swapped = hundreds * 100 + ones * 10 + tens;
    if (swapped >= 101 && swapped <= 200 && swapped !== n) {
      distractors.add(wordConverter(swapped));
    }
  }
  
  // Rule 2: Off by one ten (+10 or -10)
  const plusTen = n + 10;
  const minusTen = n - 10;
  if (plusTen >= 101 && plusTen <= 200) {
    distractors.add(wordConverter(plusTen));
  }
  if (minusTen >= 101 && minusTen <= 200) {
    distractors.add(wordConverter(minusTen));
  }
  
  // Rule 3: Off by one (+1 or -1)
  const plusOne = n + 1;
  const minusOne = n - 1;
  if (plusOne >= 101 && plusOne <= 200) {
    distractors.add(wordConverter(plusOne));
  }
  if (minusOne >= 101 && minusOne <= 200) {
    distractors.add(wordConverter(minusOne));
  }
  
  // Fallback: Random numbers in range
  while (distractors.size < count) {
    const rand = Math.floor(rng() * 100) + 101;
    if (rand !== n) {
      distractors.add(wordConverter(rand));
    }
  }
  
  const result = Array.from(distractors).slice(0, count);
  const correct = wordConverter(n);
  return shuffleWithRng([...result, correct], rng);
}

function generateNumeralDistractors(n, count, rng) {
  const distractors = new Set();
  
  // Rule 1: Swap tens and ones
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  const tens = Math.floor(remainder / 10);
  const ones = remainder % 10;
  if (tens !== ones) {
    const swapped = hundreds * 100 + ones * 10 + tens;
    if (swapped >= 101 && swapped <= 200 && swapped !== n) {
      distractors.add(String(swapped));
    }
  }
  
  // Rule 2: Off by 10 (+10 or -10)
  const plusTen = n + 10;
  const minusTen = n - 10;
  if (plusTen >= 101 && plusTen <= 200) {
    distractors.add(String(plusTen));
  }
  if (minusTen >= 101 && minusTen <= 200) {
    distractors.add(String(minusTen));
  }
  
  // Rule 3: Off by 1 (+1 or -1)
  const plusOne = n + 1;
  const minusOne = n - 1;
  if (plusOne >= 101 && plusOne <= 200) {
    distractors.add(String(plusOne));
  }
  if (minusOne >= 101 && minusOne <= 200) {
    distractors.add(String(minusOne));
  }
  
  // Fallback
  while (distractors.size < count) {
    const rand = Math.floor(rng() * 100) + 101;
    if (rand !== n) {
      distractors.add(String(rand));
    }
  }
  
  const result = Array.from(distractors).slice(0, count);
  const correct = String(n);
  return shuffleWithRng([...result, correct], rng);
}

function generateDigitDistractors(correctDigit, count, rng) {
  const distractors = new Set();
  while (distractors.size < count) {
    const randDigit = String(Math.floor(rng() * 10));
    if (randDigit !== correctDigit) {
      distractors.add(randDigit);
    }
  }
  const result = Array.from(distractors);
  return shuffleWithRng([...result, correctDigit], rng);
}

function generateTypeA(numbers, rng) {
  return numbers.map(n => ({
    type: 'A',
    id: `A_${n}`,
    stem: `What is the word form of ${n}?`,
    stemAudio: `What is the word form of ${n}?`,
    correct: numberToWords(n),
    options: generateDistractors(n, numberToWords, 3, rng),
  }));
}

function generateTypeB(numbers, rng) {
  return numbers.map(n => ({
    type: 'B',
    id: `B_${n}`,
    stem: numberToWords(n),
    stemAudio: `What number is: ${numberToWords(n)}?`,
    correct: String(n),
    options: generateNumeralDistractors(n, 3, rng),
  }));
}

function generateTypeC(numbers, rng) {
  const places = ['hundreds', 'tens', 'ones'];
  return numbers.map((n, i) => {
    const place = places[i % 3];
    const answer = getDigitAtPlace(n, place);
    return {
      type: 'C',
      id: `C_${n}_${place}`,
      stem: `What digit is in the ${place} place of ${n}?`,
      stemAudio: `In the number ${n}, what digit is in the ${place} place?`,
      correct: String(answer),
      options: generateDigitDistractors(answer, 3, rng),
    };
  });
}

function generateTypeD(numbers, rng) {
  return numbers.map((n, i) => {
    const other = numbers[(i + 1) % numbers.length];
    const greater = Math.max(n, other);
    const options = shuffleWithRng([String(n), String(other)], rng);
    return {
      type: 'D',
      id: `D_${n}_${other}`,
      stem: `Which number is greater: ${n} or ${other}?`,
      stemAudio: `Which is greater: ${n} or ${other}?`,
      correct: String(greater),
      options: options,
    };
  });
}

export function generateQuestionBank(seed = Date.now()) {
  const rng = seededRandom(seed);
  const bank = [];
  const numbers = shuffleWithRng([...Array(100)].map((_, i) => i + 101), rng);
  
  // 25 of each type
  bank.push(...generateTypeA(numbers.slice(0, 25), rng));
  bank.push(...generateTypeB(numbers.slice(25, 50), rng));
  bank.push(...generateTypeC(numbers.slice(50, 75), rng));
  bank.push(...generateTypeD(numbers.slice(75, 100), rng));
  
  return shuffleWithRng(bank, rng); // Final shuffle
}
