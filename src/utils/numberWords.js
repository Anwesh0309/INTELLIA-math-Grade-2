// src/utils/numberWords.js
// Converts integers 100–200 to English word form (Singapore MOE standard)

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six',
              'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
              'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
              'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty',
              'sixty', 'seventy', 'eighty', 'ninety'];

export function numberToWords(n) {
  if (n === 100) return 'one hundred';
  if (n === 200) return 'two hundred';
  if (n < 100 || n > 200) throw new Error('Out of module range');
  
  const remainder = n - 100;
  if (remainder < 20) return `one hundred and ${ONES[remainder]}`;
  
  const tens = Math.floor(remainder / 10);
  const ones = remainder % 10;
  const tensWord = TENS[tens];
  const onesWord = ones ? `-${ONES[ones]}` : '';
  return `one hundred and ${tensWord}${onesWord}`;
}

export function wordsToNumber(words) {
  const cleanWords = words.toLowerCase().trim();
  if (cleanWords === 'one hundred') return 100;
  if (cleanWords === 'two hundred') return 200;
  
  for (let i = 101; i <= 200; i++) {
    if (numberToWords(i) === cleanWords) return i;
  }
  return null;
}
